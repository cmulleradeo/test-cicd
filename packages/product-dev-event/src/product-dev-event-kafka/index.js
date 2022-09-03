import jsonSampleConfig from './sample_config.json'

import Product from './product-dev'
let prefixEnv = 'KAFKA-TO-KAFKA'

export default class KafkaToKafka {
  constructor (coreServices, config) {
    this.config = config
    this.pluginInfos = {
      name: this.config.PLUGIN_NAME,
      version: this.config.PLUGIN_VERSION,
      stream: this.config.STREAM,
      feature: 'kafka-to-kafka'
    }
    this.logInfos = {
      stream: this.pluginInfos.stream,
      feature: this.pluginInfos.feature,
      labels: {
        plugin: this.config.PLUGIN_NAME
      }
    }
    this.product = new Product(coreServices, this.pluginInfos, config)
    this.kafkaConsumer = coreServices.KafkaConsumer
    this.logger = coreServices.Logger
    this.errorHandler = coreServices.ErrorHandler
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
    await this.product.processEvent(message)
  }

  /**
   * Called when the application starts.
   *
   * @returns {Promise} Return promise if succeed and error if fails.
   */
  start = async () => {
    try {
      const workerQueue = this.kafkaConsumer.createWorkerQueue(this.worker, parseInt(this.config.CONSUMER_NB_WORKER), this.pluginInfos)
      workerQueue.error(this.createErrorCallback)
      const topicList = [{
        topic: this.config.CONSUMER_TOPIC,
        workerQueue
      }]
      await this.kafkaConsumer.createConsumerGroup(this.config.CONSUMER_GROUP_ID, topicList, this.pluginInfos, true)
    } catch (err) {
      this.errorHandler.handleError(err)
      throw err
    }
    this.logger.info(`Successfully initialized the ${this.config.PLUGIN_NAME} plugin.`, this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.start()`, this.logInfos)
  }
}
