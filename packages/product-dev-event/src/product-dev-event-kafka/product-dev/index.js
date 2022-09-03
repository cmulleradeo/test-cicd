import {
  generateLogInfos
} from '@metric/acl-common-modules'
import axios from 'axios'

export default class Product {
  constructor (coreServices, pluginInfos, config) {
    this.pluginInfos = pluginInfos
    this.config = config
    this.logInfos = {
      feature: 'product-dev-event-kafka',
      stream: config.STREAM,
      labels: {
        plugin: config.PLUGIN_NAME
      }
    }
    this.logger = coreServices.Logger
    this.kafkaProducer = coreServices.KafkaProducer
  }

  /**
   * Process the message concerning Activity received from Kafka.
   *
   * @param {object} message The new attributes to update.
   * @param {number} message.id Identifier of the entity.
   */
  processEvent = async (message) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.processEvent(message=${message})`, generateLogInfos(this.pluginInfos))
    if (!message) {
      throw new Error('Event message is null')
    }
    const messageValue = JSON.parse(message.value)

    const urlRequest = this.config.CALL_API + messageValue.matrixId + '?x-gateway-apikey=' + this.config.API_KEY
    const encodedURI = encodeURI(urlRequest)
    const response = await this.sendGetRequest(encodedURI)

    if (typeof (response) !== 'undefined') {
      // à revoir pour le familyId quand developpé pour l'instant absent en PROD
      if (!response.data.family.familyId) {
        if (response.data.family) {
          response.data.family = {
            familyId: response.data?.family.split('-')[0].trim() || null,
            familyName: response.data?.family
          }
        } else {
          response.data.family = {
            familyId: null,
            familyName: null
          }
        }
      }

      const test = { matrixId: messageValue.matrixId }
      const producedValue = response.data
      const kafkaMessage = {
        topic: this.config.PRODUCER_TOPIC,
        key: test,
        messages: [
          producedValue
        ]
      }
      await this.kafkaProducer.createProducer(this.pluginInfos)
      await this.kafkaProducer.sendMessageWithKey(kafkaMessage, this.pluginInfos)
      this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.processEvent()`, generateLogInfos(this.pluginInfos))
    } else {
      this.logger.error('Cannot send message on kafka topic cause Axios response is empty')
    }
  }

  sendGetRequest = async (url) => {
    try {
      const resp = await axios.get(url)

      return resp
    } catch (err) {
      this.logger.error(err)
    }
  }
}
