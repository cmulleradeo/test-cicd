/* eslint-disable security/detect-object-injection */
/**
 * @module plugin/generic-rabbitmq-to-kafka
 * @description Internal plugin which converts Kafka messages to PubSub messages.
 */

import jsonSampleConfig from './sample_config.json'

let prefixEnv = 'GENERIC_RABBITMQ_TO_KAFKA'

export default class GenericRabbitMQToKafkaPlugin {
  constructor ({ Logger, KafkaProducer, RabbitMQConsumer, ErrorHandler }, config) {
    // Core services
    this.logger = Logger
    this.kafkaProducer = KafkaProducer
    this.rabbitMQConsumer = RabbitMQConsumer
    this.errorHandler = ErrorHandler

    // Environment configuration
    this.config = config

    this.pluginInfos = {
      name: this.config.PLUGIN_NAME,
      version: this.config.PLUGIN_VERSION,
      stream: this.config.STREAM,
      feature: 'rabbitmq-to-kafka'
    }

    this.logInfos = {
      stream: this.pluginInfos.stream,
      feature: this.pluginInfos.feature,
      labels: {
        plugin: this.config.PLUGIN_NAME
      }
    }
  }

  // Prefix functions
  getPrefixEnv () { return prefixEnv }
  setPrefixEnv (prefix) { prefixEnv = prefix }

  // Retrieve the sample config from JSON file
  static getJsonSampleConfig () { return jsonSampleConfig }

  /**
   * Handler applied to every RabbitMQ message.
   *
   * @param {object} message Message received from RabbitMq.
   * @param {Buffer} message.content Buffer with the content of the message
   */
  rabbitMqMessageHandler = async (message) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.rabbitMqMessageHandler()`, this.logInfos)

    const content = message.content.toString()
    let parseMessageContent
    try {
      parseMessageContent = JSON.parse(content)
    } catch {
      throw new this.errorHandler.PluginError({
        message: 'Failed to parse the JSON content received from RabbitMQ',
        labels: {
          json: content
        },
        ...this.pluginInfos
      })
    }

    const kafkaMessage = {
      topic: this.config.KAFKA_TOPIC,
      key: parseMessageContent.domain,
      messages: [
        { content }
      ]
    }

    await this.kafkaProducer.sendMessageInJson(kafkaMessage, this.pluginInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.rabbitMqMessageHandler()`, this.logInfos)
  }

  /**
   * Launch function of the plugin and master of the orchestration of its execution.
   *
   * @returns {Promise} Resolved promise if success, rejected with error otherwise.
   */
  start = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.start()`, this.logInfos)

    try {
      await this.kafkaProducer.createProducer(this.pluginInfos)
      this.rabbitMQConsumer.initConsumer(this.pluginInfos, this.rabbitMqMessageHandler)
    } catch (err) {
      this.logger.error(`Error in ${this.config.PLUGIN_NAME}.start(): ${err.message}`, { exception: err.stack, ...this.logInfos })
      throw new Error('Failed to start')
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.start()`, this.logInfos)
    }
  }
}
