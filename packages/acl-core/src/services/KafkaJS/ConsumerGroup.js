/**
 * @module services/KafkaJS/ConsumerGroup
 * @description Core service to manage Kafka messages consumption.
 * @requires module:services/Logger
 */

import util from 'util'
import queue from 'async/queue'
import lodash from 'lodash'
import https from 'https'
import { Kafka, logLevel } from 'kafkajs'
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'

import Logger from '../Logger'
import Datadog from '../Datadog'
import ErrorHandler from '../ErrorHandler'

/**
 * Generate a worker queue.
 *
 * @param {Function} worker - Function to be executed on each element of the queue.
 * @param {number} concurrency - Number of worker functions executed at the same time.
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {object} Worker queue to provide to the topic.
 */
const createWorkerQueue = (worker, concurrency, pluginInfos) => {
  Logger.debug(`>>>> Entering in Kafka.ConsumerGroup.createWorkerQueue(worker = ${util.inspect(worker)} concurrency = ${util.inspect(concurrency)}), pluginInfos = ${util.inspect(pluginInfos)})`,
    { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
  Logger.debug('<<<< Exiting Kafka.ConsumerGroup.createWorkerQueue()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
  return queue(worker, concurrency)
}

/**
 * Get the worker queue index of a topic.
 *
 * @param {object} _workerQueues - List of worker queues.
 * @param {object} topic - Topic to find the good worker queue.
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @returns {number} Index of the good worker queue.
 */
const getQueueIndex = (_workerQueues, topic, pluginInfos) => {
  Logger.debug(`>>>> Entering in Kafka.ConsumerGroup.getQueueIndex(_workerQueues = ${util.inspect(_workerQueues)} topic = ${util.inspect(topic)}), pluginInfos = ${util.inspect(pluginInfos)})`,
    { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
  const _workerIndex = lodash.findIndex(_workerQueues, (value) => {
    return value.topic === topic && typeof value.workerQueue === 'object'
  })
  Logger.debug('<<<< Exiting Kafka.ConsumerGroup.getQueueIndex()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
  return _workerIndex
}

/**
 * Create a Kafka consumer.
 *
 * @param {string} groupId - Id of the group the topics belongs to.
 * @param {Array<object>} topics - Array of kafka topics to listen to.
 * @param {string} topics.topic - Name of the topic.
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @param {boolean} [useSchemaRegistry] - Indicates if the messages should be decoded with the schema registry.
 * @returns {Promise} Resolved promise if success, rejected in case of error
 */
const createConsumerGroup = async (groupId, topics, pluginInfos, useSchemaRegistry = true) => {
  Logger.debug(`>>>> Entering in Kafka.ConsumerGroup.createConsumerGroup(groupId = ${groupId}, topics = ${util.inspect(topics)} pluginInfos = ${util.inspect(pluginInfos)})`,
    { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })

  if (!process.env.KAFKA_HOST || !process.env.KAFKA_REGISTRY) {
    throw new ErrorHandler.ConfigError({
      message: 'Missing kafka host or registry',
      ...pluginInfos,
      config: {
        kafkaHost: process.env.KAFKA_HOST,
        kafkaRegistry: process.env.KAFKA_REGISTRY
      }
    })
  }

  const workerQueues = topics.map((element) => ({ topic: element.topic, workerQueue: element.workerQueue }))
  const topicsArray = topics.map((element) => {
    return element.topic
  })

  const config = {
    clientId: 'Metric ACL Kafka Consumer Service',
    brokers: [process.env.KAFKA_HOST],
    ssl: process.env.KAFKA_SSL,
    connectionTimeout: +process.env.KAFKA_CONNECT_TIMEOUT || 1000,
    requestTimeout: +process.env.KAFKA_REQUEST_TIMEOUT || 30000,
    logLevel: logLevel.NOTHING
  }

  /* istanbul ignore else */
  if (process.env.KAFKA_SSL) {
    config.sasl = {
      mechanism: process.env.KAFKA_SASL_MECHANISM,
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD
    }
  }

  const kafka = new Kafka(config)
  const registry = new SchemaRegistry({
    host: process.env.KAFKA_REGISTRY,
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  })

  let consumer
  try {
    consumer = kafka.consumer({
      groupId,
      allowAutoTopicCreation: false
    })

    await consumer.connect()
  } catch (err) {
    throw new ErrorHandler.KafkaError({
      message: `Failed to connect to the Kafka consumer: ${err.message}`,
      stack: err.stack,
      ...pluginInfos
    })
  }

  const subscribingErrors = []

  await Promise.all(topicsArray.map(async (topic) => {
    try {
      await consumer.subscribe({
        topic,
        fromBeginning: true
      })
    } catch (err) {
      subscribingErrors.push(`${topic}: ${err}`)
    }
  }))

  if (subscribingErrors.length > 0) {
    Logger.debug('<<<< Exiting Kafka.ConsumerGroup.createConsumerGroup()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
    throw new ErrorHandler.KafkaError({
      message: 'Failed to subscribe to Kafka topics',
      kafkaTopic: subscribingErrors.reduce((acc, val) => acc + `; ${val}`),
      ...pluginInfos
    })
  }

  /*
  * autoCommitThreshold is used by commitOffsetsIfNecessary. It will commit if the threshold is reached otherwise it will not commit.
  * autoCommit is set to false to avoid committing the offset in case of error.
  */
  consumer.run({
    eachBatchAutoResolve: false,
    autoCommitThreshold: 1,
    autoCommit: false,
    // Defines what to do with each batch of messages
    eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, commitOffsetsIfNecessary, isStale }) => {
      Logger.debug(`>>>> Entering in Kafka.ConsumerGroup.eachBatch(batch = ${util.inspect(batch)} resolveOffset = ${util.inspect(resolveOffset)} heartbeat = ${util.inspect(heartbeat)} isRunning = ${util.inspect(isRunning)} commitOffsetsIfNecessary = ${util.inspect(commitOffsetsIfNecessary)} isStale = ${util.inspect(isStale)})`,
        { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
      Logger.debug(`Received a batch of ${batch.messages.length} messages to process`, { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })

      Datadog.gaugeMetric(pluginInfos, 'kafka_consumer_batch_byte_size', Buffer.from(JSON.stringify(batch.messages)).byteLength, [batch.topic])
      Datadog.gaugeMetric(pluginInfos, 'kafka_consumer_batch_length', batch.messages.length, pluginInfos, [batch.topic])
      Datadog.incrementMetric(pluginInfos, 'kafka_consumer_received_batch', 1, [batch.topic])

      const { topic, messages } = batch

      const workerQueueIndex = getQueueIndex(workerQueues, topic)
      if (workerQueueIndex === -1) {
        Logger.error('Failed to process the message batch: the topic is missing in the worker queue', { labels: { service: 'Kafka', plugin: pluginInfos.name } })
        return null
      }
      const { workerQueue } = workerQueues[parseInt(workerQueueIndex)]

      for (const message of messages) {
        Logger.debug('Processing a new message from batch', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
        if (!isRunning() || isStale()) {
          break
        }

        let decodedKey
        if (message.key) {
          try {
            decodedKey = await registry.decode(message.key)
          } catch (error) {
            // Trying to decode buffer with kafka registry schema, if error then decoding buffer into string
            decodedKey = message.key.toString()
          }
        } else {
          Logger.error('An error occurred while decoding the message key: message.key is null', { labels: { service: 'Kafka', plugin: pluginInfos.name } })
        }

        let decodedMessage
        try {
          decodedMessage = await registry.decode(message.value)
        } catch (err) {
          // If the service should use the schema registry, then logs an error.
          if (useSchemaRegistry) {
            const errorDetails = {
              exception: err.stack,
              labels: {
                service: 'Kafka',
                plugin: pluginInfos.name,
                topic
              }
            }
            Logger.error(`An error occurred while decoding the message value: ${err.message}`, errorDetails)
          } else {
            // Otherwise read the buffer without decoding.
            decodedMessage = message.value.toString()
          }
        }

        const headers = message.headers
        /* istanbul ignore else */
        if (headers) {
          Object.keys(headers).forEach((key) => { headers[`${key}`] = headers[`${key}`].toString() })
        }

        if (decodedMessage && decodedKey) {
          workerQueue.push({
            key: decodedKey,
            timestamp: message.timestamp,
            value: decodedMessage,
            headers
          })
          Logger.debug('Message successfully decoded and pushed to worker queue', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name, key: decodedKey } })
        }

        try {
          resolveOffset(message.offset)
          await heartbeat()
        } catch (err) {
          Logger.error(`An error occurred while processing one of the batch message: ${err.message}`, { exception: err.stack, stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
        }
        Logger.debug('Batch message processed', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
      }

      // If there are items waiting or being processed in the worker queue
      /* istanbul ignore else */
      if (!workerQueue.idle()) {
        await workerQueue.drain()
      }
      await commitOffsetsIfNecessary()
      Logger.debug('<<<< Exiting Kafka.ConsumerGroup.eachBatch()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
    }
  }).catch((err) => {
    const errorDetails = err instanceof ErrorHandler.KafkaError
      ? err.formatError()
      : { exception: err.stack, stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } }
    Logger.error(`An error occurred with the Kafka consumer: ${err.message}`, errorDetails)
  })

  Logger.info('ConsumerGroup created', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
  Logger.debug('<<<< Exiting Kafka.ConsumerGroup.createConsumerGroup()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'Kafka', plugin: pluginInfos?.name } })
}

module.exports = {
  createWorkerQueue,
  getQueueIndex,
  createConsumerGroup
}
