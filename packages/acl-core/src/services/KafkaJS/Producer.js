/**
 * @module services/KafkaJS/Producer
 * @description Core service to manage Kafka production.
 * @requires module:services/Logger
 */

import lodash from 'lodash'
import util from 'util'
import https from 'https'
import { Kafka, CompressionTypes, logLevel } from 'kafkajs'
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'

import Logger from '../Logger'
import Datadog from '../Datadog'
import ErrorHandler from '../ErrorHandler'

const producers = []
const registries = []
const valuesSchema = []
const keysSchema = []
const SERVICE = {
  KAFKA: 'Kafka'
}

/**
 * Check the pluginInfos.
 *
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} [pluginInfos.name] - Calling plugin name.
 * @param {string} [pluginInfos.version] - Calling plugin version.
 */
function checkPluginInfos (pluginInfos) {
  if (!pluginInfos || !pluginInfos.name || !pluginInfos.version) {
    throw new ErrorHandler.MetricBaseError({
      message: 'Error pluginInfos is incomplete, pluginInfos.name and pluginInfos.version are required',
      ...pluginInfos
    })
  }
}

/**
 * Get the logInfo.
 *
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.feature] - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @returns {object} format logInfo.
 */
function getLogInfo (pluginInfos) {
  return {
    stream: pluginInfos.stream || null,
    feature: pluginInfos.feature || null,
    labels: {
      service: SERVICE.KAFKA,
      plugin: pluginInfos.name
    }
  }
}

/**
 * Merge object with pluginInfos.name and pluginInfos.version and return the result.
 *
 * @param {string} latestSchemaId - A id schema get from register.
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} topicName - Specifique topic name.
 * @returns {object} - processed object.
 */
function bindSchemaInfo (latestSchemaId, pluginInfos, topicName) {
  return {
    schemaId: latestSchemaId,
    pluginName: pluginInfos.name,
    version: pluginInfos.version,
    topic: topicName
  }
}

/**
 * Get the plugin's current instance of Producer.
 *
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {object} The producer.
 * @throws If there are no Producer instance matching the plugin information.
 */
function getProducerInstance (pluginInfos) {
  Logger.debug(`>>>> Entering in Kafka.Producer.getProducerInstance(pluginInfos = ${util.inspect(pluginInfos)})`, getLogInfo(pluginInfos))
  const index = lodash.findIndex(producers, (value) => {
    return value.pluginName === pluginInfos.name && value.version === pluginInfos.version
  })

  Logger.debug('<<<< Exiting Kafka.Producer.getProducerInstance()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
  if (index !== -1) {
    return producers[parseInt(index)]
  } else {
    throw new ErrorHandler.MetricBaseError({ message: 'No producer instance for the plugin', ...pluginInfos })
  }
}

/**
 * Get the plugin's current instance of Registry.
 *
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {object} The registry.
 * @throws If there are no Registry instance matching the plugin information.
 */
function getRegistryInstance (pluginInfos) {
  Logger.debug(`>>>> Entering in Kafka.Producer.getRegistryInstance(pluginInfos = ${util.inspect(pluginInfos)})`,
    getLogInfo(pluginInfos))
  const index = lodash.findIndex(registries, (value) => {
    return value.pluginName === pluginInfos.name && value.version === pluginInfos.version
  })

  Logger.debug('<<<< Exiting Kafka.Producer.getRegistryInstance()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
  if (index !== -1) {
    return registries[parseInt(index)]
  } else {
    throw new ErrorHandler.MetricBaseError({ message: 'No registry instance for the plugin', ...pluginInfos })
  }
}

/**
 * @param topic
 * @param registry
 * @param pluginInfos
 */
async function getKeySchemaId (topic, registry, pluginInfos) {
  Logger.debug(`>>>> Entering in Kafka.Producer.getKeySchemaId(pluginInfos = ${util.inspect(pluginInfos)})`, getLogInfo(pluginInfos))
  try {
    const index = lodash.findIndex(keysSchema, (keySchema) => {
      return keySchema.pluginName === pluginInfos.name && keySchema.version === pluginInfos.version && keySchema.topic === topic
    })

    if (index !== -1) {
      return keysSchema[parseInt(index)].schemaId
    } else {
      const latestSchemaId = await registry.getLatestSchemaId(topic + '-key')
      const keySchema = bindSchemaInfo(latestSchemaId, pluginInfos, topic)

      keysSchema.push(keySchema)

      return keySchema.schemaId
    }
  } catch (error) {
    throw new ErrorHandler.MetricBaseError({
      message: `Error in getKeySchemaId: ${error.message}`,
      ...pluginInfos
    })
  } finally {
    Logger.debug('<<<< Exiting Kafka.Producer.getKeySchemaId()', getLogInfo(pluginInfos))
  }
}

/**
 * Get the plugin's current instance of valueSchemaId.
 *
 * @param {string} topic - Subobject topic of payload.
 * @param {object} registry - The registry.
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {object} The value schema specifique of plugin.
 */
async function getValueSchemaId (topic, registry, pluginInfos) {
  Logger.debug(`>>>> Entering in Kafka.Producer.getValueSchemaId(topic = ${topic}, registry = ${util.inspect(registry)})`, getLogInfo(pluginInfos))
  try {
    const index = lodash.findIndex(valuesSchema, (valueSchema) => {
      return valueSchema.pluginName === pluginInfos.name && valueSchema.version === pluginInfos.version && valueSchema.topic === topic
    })

    if (index !== -1) {
      return valuesSchema[parseInt(index)].schemaId
    } else {
      const latestSchemaId = await registry.getLatestSchemaId(topic + '-value')
      const valueSchema = bindSchemaInfo(latestSchemaId, pluginInfos, topic)

      valuesSchema.push(valueSchema)

      return valueSchema.schemaId
    }
  } catch (error) {
    throw new ErrorHandler.MetricBaseError({
      message: `Error in getValueSchemaId: ${error.message}`,
      ...pluginInfos
    })
  } finally {
    Logger.debug('<<<< Exiting Kafka.Producer.getValueSchemaId()', getLogInfo(pluginInfos))
  }
}

/**
 * Push an array of messages to the Kafka cluster.
 *
 * @param {object} producer Kafka's producer.
 * @param {string} topic Topic to publish the messages.
 * @param {string} key Key of the messages.
 * @param {Array} messages Array of messages.
 * @param {object} pluginInfos Plugin's info.
 */
async function pushMessageToProducer (producer, topic, messages, pluginInfos) {
  Logger.debug(`>>>> Entering in Kafka.Producer.pushMessageToProducer(producer, topic=${topic},  messages=${util.inspect(messages)}, pluginInfos)`, getLogInfo(pluginInfos))
  try {
    await producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages
    })
    Datadog.gaugeMetric(pluginInfos, 'kafka_producer_batch_byte_size', Buffer.from(messages).byteLength, [topic])
    Datadog.gaugeMetric(pluginInfos, 'kafka_producer_batch_length', messages.length, [topic])
    Datadog.incrementMetric(pluginInfos, 'kafka_producer_sent_batch', 1, [topic])
    Logger.debug('Message(s) properly sent', { stream: pluginInfos.stream || null, feature: pluginInfos.feature || null, labels: { service: SERVICE.KAFKA, plugin: pluginInfos.name } })
  } catch (err) {
    throw new ErrorHandler.KafkaError({
      kafkaTopic: topic,
      kafkaMessages: messages,
      message: `Failed to send messages: ${err.message}`,
      stack: err.stack,
      ...pluginInfos
    })
  }
  Logger.debug('<<<< Exiting Kafka.Producer.pushMessageToProducer()', getLogInfo(pluginInfos))
}

/**
 * Push an array of messages to the Kafka cluster.
 *
 * @param {object} producer Kafka's producer.
 * @param {string} topic Topic to publish the messages.
 * @param {string} key Key of the messages.
 * @param {Array} messages Array of messages.
 * @param {object} pluginInfos Plugin's info.
 */
async function pushMessageToProducerWithKey (producer, topic, key, messages, pluginInfos) {
  Logger.debug(`>>>> Entering in Kafka.Producer.pushMessageToProducer(producer, topic=${topic}, key=${util.inspect(key)}, messages=${util.inspect(messages)}, pluginInfos)`, getLogInfo(pluginInfos))
  try {
    await producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages
    })
    Datadog.gaugeMetric(pluginInfos, 'kafka_producer_batch_byte_size', Buffer.from(messages).byteLength, [topic])
    Datadog.gaugeMetric(pluginInfos, 'kafka_producer_batch_length', messages.length, [topic])
    Datadog.incrementMetric(pluginInfos, 'kafka_producer_sent_batch', 1, [topic])
    Logger.debug('Message(s) properly sent', { stream: pluginInfos.stream || null, feature: pluginInfos.feature || null, labels: { service: SERVICE.KAFKA, plugin: pluginInfos.name, key } })
  } catch (err) {
    throw new ErrorHandler.KafkaError({
      kafkaTopic: topic,
      kafkaMessages: messages,
      message: `Failed to send messages: ${err.message}`,
      stack: err.stack,
      ...pluginInfos
    })
  }
  Logger.debug('<<<< Exiting Kafka.Producer.pushMessageToProducer()', getLogInfo(pluginInfos))
}

/**
 * Send one or many message(s) on a Kafka topic.
 *
 * @param {object} payload - Payload containing the messages to send to Kafka.
 * @param {string} payload.topic - Receiver's topic name.
 * @param {object[]} payload.messages - Messages to send.
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {Promise} - Resolved promise if success.
 */
async function sendMessageWithKey (payload, pluginInfos) {
  checkPluginInfos(pluginInfos)
  Logger.debug(`>>>> Entering in Kafka.Producer.sendMessage(payload = ${util.inspect(payload)}, pluginInfos = ${util.inspect(pluginInfos)})`, getLogInfo(pluginInfos))
  Logger.debug('Going to send message(s)...', { stream: pluginInfos.stream || null, feature: pluginInfos.feature || null, labels: { service: SERVICE.KAFKA, plugin: pluginInfos.name, key: payload.key } })
  try {
    const { producer } = getProducerInstance(pluginInfos)
    const { registry } = getRegistryInstance(pluginInfos)
    const keySchemaId = await getKeySchemaId(payload.topic, registry, pluginInfos)
    const valueSchemaId = await getValueSchemaId(payload.topic, registry, pluginInfos)

    const messages = await Promise.all(payload.messages.map(async (message) => {
      let key
      try {
        key = await registry.encode(keySchemaId, payload.key)
      } catch (error) {
        throw new ErrorHandler.KafkaError({
          message: `Failed to encode key: ${util.inspect(payload.key)}`,
          ...pluginInfos,
          stack: error.stack,
          kafkaTopic: payload.topic,
          kafkaMessages: message
        })
      }

      let value
      try {
        value = await registry.encode(valueSchemaId, message)
      } catch (error) {
        throw new ErrorHandler.KafkaError({
          message: `Failed to encode value: ${util.inspect(message)}`,
          ...pluginInfos,
          stack: error.stack,
          kafkaTopic: payload.topic,
          kafkaMessages: message
        })
      }

      return {
        key,
        value,
        headers: payload.headers
      }
    }))
    await pushMessageToProducerWithKey(producer, payload.topic, payload.key, messages, pluginInfos)
  } finally {
    Logger.debug('<<<< Exiting Kafka.Producer.sendMessage()', getLogInfo(pluginInfos))
  }
}

/**
 * Send one or many message(s) on a Kafka topic.
 *
 * @param {object} payload - Payload containing the messages to send to Kafka.
 * @param {string} payload.topic - Receiver's topic name.
 * @param {object[]} payload.messages - Messages to send.
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {Promise} - Resolved promise if success.
 */
async function sendMessage (payload, pluginInfos) {
  checkPluginInfos(pluginInfos)
  Logger.debug(`>>>> Entering in Kafka.Producer.sendMessage(payload = ${util.inspect(payload)}, pluginInfos = ${util.inspect(pluginInfos)})`, getLogInfo(pluginInfos))
  Logger.debug('Going to send message(s)...', { stream: pluginInfos.stream || null, feature: pluginInfos.feature || null, labels: { service: SERVICE.KAFKA, plugin: pluginInfos.name, key: payload.key } })
  try {
    const { producer } = getProducerInstance(pluginInfos)
    const { registry } = getRegistryInstance(pluginInfos)
    // const keySchemaId = await getKeySchemaId(payload.topic, registry, pluginInfos)
    const valueSchemaId = await getValueSchemaId(payload.topic, registry, pluginInfos)

    const messages = await Promise.all(payload.messages.map(async (message) => {
      let value
      try {
        value = await registry.encode(valueSchemaId, message)
      } catch (error) {
        throw new ErrorHandler.KafkaError({
          message: `Failed to encode value: ${util.inspect(message)}`,
          ...pluginInfos,
          stack: error.stack,
          kafkaTopic: payload.topic,
          kafkaMessages: message
        })
      }

      return {
        // key,
        value,
        headers: payload.headers
      }
    }))
    await pushMessageToProducer(producer, payload.topic, messages, pluginInfos)
  } finally {
    Logger.debug('<<<< Exiting Kafka.Producer.sendMessage()', getLogInfo(pluginInfos))
  }
}

/**
 * Send one or many message(s) on a Kafka topic using a JSON format.
 *
 * @param {object} payload Payload to send to Kafka
 * @param {string} payload.headers Headers of the messages.
 * @param {string} payload.topic Topic of the messages.
 * @param {string} payload.key Key of the message.
 * @param {string[]} payload.messages Messages to send.
 * @param {object} pluginInfos Plugin's info
 */
async function sendMessageInJson (payload, pluginInfos) {
  checkPluginInfos(pluginInfos)
  Logger.debug(`>>>> Entering in Kafka.Producer.sendMessage(payload, pluginInfos = ${util.inspect(pluginInfos)})`, getLogInfo(pluginInfos))
  const messages = payload.messages.map((msg) => {
    return {
      key: payload.key,
      value: JSON.stringify(msg),
      headers: payload.headers
    }
  })

  const { producer } = getProducerInstance(pluginInfos)
  try {
    await producer.send({
      topic: payload.topic,
      compression: CompressionTypes.GZIP,
      messages
    })
    Datadog.gaugeMetric(pluginInfos, 'kafka_producer_batch_byte_size', Buffer.from(messages).byteLength, [payload.topic])
    Datadog.gaugeMetric(pluginInfos, 'kafka_producer_batch_length', messages.length, [payload.topic])
    Datadog.incrementMetric(pluginInfos, 'kafka_producer_sent_batch', 1, [payload.topic])
    Logger.debug('Message(s) properly sent', { stream: pluginInfos.stream || null, feature: pluginInfos.feature || null, labels: { service: SERVICE.KAFKA, plugin: pluginInfos.name, key: payload.key } })
  } catch (err) {
    throw new ErrorHandler.KafkaError({
      kafkaTopic: payload.topic,
      kafkaMessages: messages,
      message: `Failed to send messages: ${err.message}`,
      stack: err.stack,
      ...pluginInfos
    })
  }

  Logger.debug('<<<< Exiting Kafka.Producer.sendMessage()', getLogInfo(pluginInfos))
}

/**
 * Create a Kafka producer.
 *
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {Promise} Resolved promise if ok, rejected in case of error.
 */
async function createProducer (pluginInfos) {
  checkPluginInfos(pluginInfos)
  Logger.debug(`>>>> Entering in Kafka.Producer.createProducer(pluginInfos = ${util.inspect(pluginInfos)})`, getLogInfo(pluginInfos))

  if (!process.env.KAFKA_HOST || !process.env.KAFKA_REGISTRY) {
    throw new ErrorHandler.ConfigError({
      message: 'Missing kafka host or registry',
      ...pluginInfos,
      config: {
        KafkaHost: process.env.KAFKA_HOST,
        kafkaRegistry: process.env.KAFKA_REGISTRY
      }
    })
  }

  try {
    const config = {
      clientId: 'Metric ACL Kafka Producer Service',
      brokers: [process.env.KAFKA_HOST],
      ssl: process.env.KAFKA_SSL,
      connectionTimeout: +process.env.KAFKA_CONNECT_TIMEOUT || 1000,
      requestTimeout: +process.env.KAFKA_REQUEST_TIMEOUT || 30000,
      logLevel: logLevel.NOTHING
    }
    if (process.env.KAFKA_SSL) {
      config.sasl = {
        mechanism: process.env.KAFKA_SASL_MECHANISM,
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
      }
    }

    const kafka = new Kafka(config)
    let producer
    try {
      producer = kafka.producer()
      await producer.connect()
    } catch (err) {
      throw new ErrorHandler.KafkaError({
        message: `Failed to connect to the Kafka broker: ${err.message}`,
        stack: err.stack,
        ...pluginInfos
      })
    }

    const index = lodash.findIndex(producers, (value) => {
      return value.pluginName === pluginInfos.name && value.version === pluginInfos.version
    })
    if (index !== -1) {
      producers[parseInt(index)].producer = producer
      producers[parseInt(index)].kafka = kafka
    } else {
      producers.push({ pluginName: pluginInfos.name, version: pluginInfos.version, producer, kafka })
    }

    const registry = new SchemaRegistry({
      host: process.env.KAFKA_REGISTRY,
      agent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    const regIndex = lodash.findIndex(registries, (value) => {
      return value.pluginName === pluginInfos.name && value.version === pluginInfos.version
    })
    if (regIndex !== -1) {
      registries[parseInt(regIndex)].registry = registry
    } else {
      registries.push({ pluginName: pluginInfos.name, version: pluginInfos.version, registry })
    }

    Logger.info('Producer created', getLogInfo(pluginInfos))
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  } finally {
    Logger.debug('<<<< Exiting Kafka.Producer.createProducer()', getLogInfo(pluginInfos))
  }
}

/**
 * Close a Kafka producer and the connection instance.
 *
 * @param {object} pluginInfos - Informations about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {Promise} - Resolved promise when the producer is closed, rejected otherwise.
 */
async function closeProducer (pluginInfos) {
  checkPluginInfos(pluginInfos)
  Logger.debug(`>>>> Entering in Kafka.Producer.closeProducer(pluginInfos = ${util.inspect(pluginInfos)})`, getLogInfo(pluginInfos))
  const { producer } = getProducerInstance(pluginInfos)
  try {
    await producer.disconnect()
  } catch (err) {
    throw new ErrorHandler.KafkaError({
      message: `Failed to close the producer: ${err.message}`,
      stack: err.stack,
      ...pluginInfos
    })
  } finally {
    Logger.debug('<<<< Exiting Kafka.Producer.closeProducer()', getLogInfo(pluginInfos))
  }
}

export default {
  createProducer,
  sendMessage,
  sendMessageWithKey,
  closeProducer,
  sendMessageInJson
}
