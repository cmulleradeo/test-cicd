import util from 'util'
import amqp from 'amqplib/callback_api'

import Logger from '../Logger'
import ErrorHandler from '../ErrorHandler'
import utils from '../../utils/index'

/**
 * Create or open a channel with the RabbitMQ broker.
 *
 * @param {Error} channelError Error received from amqp when creating the channel.
 * @param {object} channel The channel opnened to RabbitMQ.
 * @param {object} pluginInfos Plugin infos.
 * @param {Function} callback Callback function executed for each message received on the channel.
 */
const createChannel = (channelError, channel, pluginInfos, callback) => {
  Logger.debug(`>>>> Entering in Kafka.Producer.createChannel(channelError = ${util.inspect(channelError)}, channel=${util.inspect(channel)})`, utils.generateLogInfos(pluginInfos))

  if (channelError) {
    throw new ErrorHandler.RabbitMqError({
      message: `Failed to connect to create the RabbitMQ channel: ${channelError.message}`,
      stack: channelError.stack,
      ...pluginInfos,
      labels: {
        config: {
          host: process.env.RABBITMQ_HOST,
          user: process.env.RABBITMQ_USER,
          pwd: process.env.RABBITMQ_PWD?.replace(/.*/i, '*********'),
          queue: process.env.RABBITMQ_QUEUE
        }
      }
    })
  }

  channel.assertQueue(process.env.RABBITMQ_QUEUE, {
    durable: true
  })

  // Pass the callback method from the plugin to the RabbitMQ consumer.
  channel.consume(process.env.RABBITMQ_QUEUE,
    (message) => {
      callback(message)
      channel.ack(message)
    }
  )

  Logger.info('RabbitMQ consumer successfully initialized.', utils.generateLogInfos(pluginInfos))
  Logger.debug('<<<< Exiting Kafka.Producer.createChannel()', utils.generateLogInfos(pluginInfos))
}

/**
 * Function to initialize a RabbitMQ consumer.
 *
 * @param {object} pluginInfos The plugin's info
 * @param {Function} callback The callback method to execute for each message.
 */
const initConsumer = (pluginInfos, callback) => {
  Logger.debug(`>>>> Entering in Kafka.Producer.closeProducer(pluginInfos = ${util.inspect(pluginInfos)})`, utils.generateLogInfos(pluginInfos))

  if (!process.env.RABBITMQ_HOST || !process.env.RABBITMQ_USER || !process.env.RABBITMQ_PWD || !process.env.RABBITMQ_QUEUE) {
    throw new ErrorHandler.ConfigError({
      message: 'Missing RabbitMQ configuration',
      ...pluginInfos,
      config: {
        RABBITMQ_HOST: process.env.RABBITMQ_HOST,
        RABBITMQ_USER: process.env.RABBITMQ_USER,
        RABBITMQ_PWD: process.env.RABBITMQ_PWD?.replace(/.*/i, '*********'),
        RABBITMQ_QUEUE: process.env.RABBITMQ_QUEUE
      }
    })
  }

  const rabbitMqConnection = {
    hostname: process.env.RABBITMQ_HOST,
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PWD
  }
  // Create to the RabbitMQ broker.
  amqp.connect(rabbitMqConnection, (connectError, connection) => {
    if (connectError) {
      throw new ErrorHandler.RabbitMqError({
        message: `Failed to connect to the RabbitMQ broker: ${connectError}`,
        stack: connectError.stack,
        ...pluginInfos,
        labels: {
          config: {
            host: process.env.RABBITMQ_HOST,
            user: process.env.RABBITMQ_USER,
            pwd: process.env.RABBITMQ_PWD?.replace(/.*/i, '*********')
          }
        }
      })
    }

    // Open a channel with the broker.
    connection.createChannel((channelError, channel) => {
      createChannel(channelError, channel, pluginInfos, callback)
    })
  })

  Logger.debug('<<<< Exiting Kafka.Producer.closeProducer()', utils.generateLogInfos(pluginInfos))
}

export default { initConsumer }
