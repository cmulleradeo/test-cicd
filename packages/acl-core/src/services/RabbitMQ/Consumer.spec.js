import RabbitMqConsumer from './Consumer.js'
import ErrorHandler from '../ErrorHandler'
import Logger from '../Logger'

const amqp = require('amqplib/callback_api')
jest.mock('amqplib/callback_api')

const config = {
  host: 'rabbitmq',
  user: 'rbuser',
  pwd: 'rbuserpass',
  queue: 'rb-queue'
}

const pluginInfos = {
  name: 'plugin_test_rabbitmq',
  version: '1.0.0'
}

const pluginCallback = jest.fn()

const MOCK_ERROR = new Error('MOCK_ERROR')

beforeEach(() => {
  process.env.RABBITMQ_HOST = config.host
  process.env.RABBITMQ_USER = config.user
  process.env.RABBITMQ_PWD = config.pwd
  process.env.RABBITMQ_QUEUE = config.queue
  Logger.debug = jest.fn()
  Logger.info = jest.fn()
  Logger.warn = jest.fn()
  Logger.error = jest.fn()
})
afterEach(() => {
  jest.restoreAllMocks()
  // eslint-disable-next-line no-undef
  __rewire_reset_all__()
  Logger.debug.mockRestore()
  Logger.info.mockRestore()
  Logger.warn.mockRestore()
  Logger.error.mockRestore()
})

describe('initConsumer()', () => {
  test('OK', (done) => {
    const mockChannel = {
      assertQueue: jest.fn(),
      consume: jest.fn().mockImplementation((queue, callback) => {
        expect(queue).toEqual(config.queue)
        expect(callback).toEqual(pluginCallback)
        done()
      })
    }

    const mockConnection = {
      createChannel: jest.fn().mockImplementation((callback) => {
        callback(null, mockChannel)
      })
    }

    const expectedConfig = {
      hostname: process.env.RABBITMQ_HOST,
      password: process.env.RABBITMQ_PWD,
      username: process.env.RABBITMQ_USER
    }
    const connectCallback = jest.fn().mockImplementation((params, callback) => {
      expect(params).toEqual(expectedConfig)
      callback(null, mockConnection)
    })

    amqp.connect = connectCallback

    RabbitMqConsumer.initConsumer(pluginInfos, pluginCallback)
  })

  test('KO with config error', () => {
    process.env.RABBITMQ_QUEUE = ''

    try {
      RabbitMqConsumer.initConsumer(pluginInfos, pluginCallback)
    } catch (err) {
      expect(err instanceof ErrorHandler.ConfigError).toBeTruthy()
      expect(pluginCallback).not.toHaveBeenCalled()
    }
  })

  test('KO with connectError', (done) => {
    const expectedConfig = {
      hostname: process.env.RABBITMQ_HOST,
      password: process.env.RABBITMQ_PWD,
      username: process.env.RABBITMQ_USER
    }
    const connectCallback = jest.fn().mockImplementation((params, callback) => {
      expect(params).toEqual(expectedConfig)
      callback(MOCK_ERROR, null)
    })

    amqp.connect = connectCallback

    try {
      RabbitMqConsumer.initConsumer(pluginInfos, pluginCallback)
    } catch (err) {
      expect(err instanceof ErrorHandler.RabbitMqError).toBeTruthy()
      expect(pluginCallback).not.toHaveBeenCalled()
      done()
    }
  })

  test('KO with channelError', (done) => {
    const mockConnection = {
      createChannel: jest.fn().mockImplementation((callback) => {
        try {
          callback(MOCK_ERROR, null)
        } catch (err) {
          expect(err instanceof ErrorHandler.RabbitMqError).toBeTruthy()
          expect(pluginCallback).not.toHaveBeenCalled()
          done()
        }
      })
    }

    const expectedConfig = {
      hostname: process.env.RABBITMQ_HOST,
      password: process.env.RABBITMQ_PWD,
      username: process.env.RABBITMQ_USER
    }
    const connectCallback = jest.fn().mockImplementation((params, callback) => {
      expect(params).toEqual(expectedConfig)
      callback(null, mockConnection)
    })

    amqp.connect = connectCallback

    RabbitMqConsumer.initConsumer(pluginInfos, pluginCallback)
  })
})
