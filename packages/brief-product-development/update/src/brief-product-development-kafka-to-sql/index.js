import jsonSampleConfig from './sample_config.json'

import Business from './business'

let prefixEnv = 'KAFKA-TO-SQL'

export default class KafkaToSql {
  constructor (coreServices, config) {
    // init log config
    this.config = config
    this.pluginInfos = {
      name: this.config.PLUGIN_NAME,
      version: this.config.PLUGIN_VERSION,
      stream: this.config.STREAM,
      feature: 'kafka-to-sql'
    }

    this.logInfos = {
      stream: this.pluginInfos.stream,
      feature: this.pluginInfos.feature,
      labels: {
        plugin: this.config.PLUGIN_NAME
      }
    }

    this.business = new Business(coreServices, this.pluginInfos, config)
    this.kafkaConsumer = coreServices.KafkaConsumer
    this.logger = coreServices.Logger
    this.errorHandler = coreServices.ErrorHandler
    this.kafkaKeys = JSON.parse(this.config.KAFKA_KEYS_TO_PROCESS)
  }

  // Retrieve the sample config from JSON file
  static getJsonSampleConfig () { return jsonSampleConfig }

  getPrefixEnv () { return prefixEnv }
  setPrefixEnv (prefix) { prefixEnv = prefix }

  /**
   * Create worker to insert, update or delete value in database.
   *
   * @param {object} message - The Kafka message.
   * @param {string} message.key - Key of the Kafka message.
   * @param {string} message.value - Value of the Kafka message.
   */
  worker = async (message) => {
    // Check if we receive a message which is in the list of message we want to treat.
    if (this.kafkaKeys.some((element) => element === message.key)) {
      const messageValue = JSON.parse(message.value)
      await this.business.processMessage(messageValue?.content, message.key)
    } else {
      this.logger.debug(`Key is not defined in the KAFKA_KEYS_TO_PROCESS:  ${message.key}`)
    }
  }

  /**
   * Called when the application starts.
   *
   * @returns {Promise} Return promise if succeed and error if fails.
   */
  start = async () => {
    try {
      await this.business.init()

      const workerQueue = this.kafkaConsumer.createWorkerQueue(this.worker, parseInt(this.config.CONSUMER_NB_WORKER), this.pluginInfos)
      workerQueue.error(this.createErrorCallback)
      const topicList = [{
        topic: this.config.CONSUMER_TOPIC,
        workerQueue
      }]

      await this.kafkaConsumer.createConsumerGroup(this.config.CONSUMER_GROUP_ID, topicList, this.pluginInfos, false)
    } catch (err) {
      this.errorHandler.errorHandler(err)
      throw err
    }

    this.logger.info(`Successfully initialized the ${this.config.PLUGIN_NAME} plugin.`, this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.start()`, this.logInfos)
  }
}
