import Plugin from 'brief-product-development-update/brief-product-development-kafka-to-sql'
import Business from 'brief-product-development-update/brief-product-development-kafka-to-sql/business'
import jsonExpectedSampleConfig from 'brief-product-development-update/brief-product-development-kafka-to-sql/sample_config.json'

jest.mock('brief-product-development-update/brief-product-development-kafka-to-sql/business')

const MOCK_ERROR = new Error('MOCK_ERROR')

const config = {
  STREAM: 'STREAM',
  PLUGIN_NAME: 'PLUGIN_NAME',
  KAFKA_KEYS_TO_PROCESS: ['MOCK_KEY']
}

let coreServices

beforeEach(() => {
  Business.mockClear()

  coreServices = {
    SQL: {},
    KafkaConsumer: {
      createWorkerQueue: jest.fn().mockReturnValue({ error: jest.fn() }),
      createConsumerGroup: jest.fn().mockResolvedValue()
    },
    ErrorHandler: {
      handleError: jest.fn()
    },
    Logger: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    }
  }
})

describe('getJsonSampleConfig()', () => {
  test('Function getJsonSampleConfig(): OK', () => {
    const received = Plugin.getJsonSampleConfig()
    expect(received).toEqual(jsonExpectedSampleConfig)
  })
})

describe('getPrefixEnv and setPrefixEnv', () => {
  test('OK default value', () => {
    const plugin = new Plugin(coreServices, config)

    expect(plugin.getPrefixEnv()).toEqual('KAFKA-TO-SQL')
  })

  test('OK new value', () => {
    const plugin = new Plugin(coreServices, config)
    plugin.setPrefixEnv('MOCK_PREFIX')

    expect(plugin.getPrefixEnv()).toEqual('MOCK_PREFIX')
  })
})

describe('start', () => {
  test('OK', async () => {
    Business.mockImplementation(() => {
      return {
        init: jest.fn().mockResolvedValue()
      }
    })
    const plugin = new Plugin(coreServices, config)

    await expect(plugin.start()).resolves.toEqual()
  })

  test('KO => failed business.init()', async () => {
    Business.mockImplementation(() => {
      return {
        init: jest.fn().mockRejectedValue(MOCK_ERROR)
      }
    })
    const plugin = new Plugin(coreServices, config)

    try {
      await plugin.start()
    } catch (err) {
      expect(err).toBe(MOCK_ERROR)
    }
  })

  test('KO => failed kafkaConsumer.createConsumerGroup()', async () => {
    const mockCreateConsumerGroup = jest.fn().mockRejectedValue(MOCK_ERROR)
    coreServices.KafkaConsumer.createConsumerGroup = mockCreateConsumerGroup
    Business.mockImplementation(() => {
      return {
        init: jest.fn().mockResolvedValue()
      }
    })
    const plugin = new Plugin(coreServices, config)

    try {
      await plugin.start()
    } catch (err) {
      expect(err).toBe(MOCK_ERROR)
    }
  })
})

describe('worker', () => {
  test('OK', () => {
    const mockMessage = {
      key: 'MOCK_KEY',
      value: '{"prop1":true,"prop2":"OK"}'
    }
    const mockProcessMessage = jest.fn()
    Business.mockImplementation(() => {
      return {
        processMessage: mockProcessMessage
      }
    })

    const plugin = new Plugin(coreServices, config)
    plugin.worker(mockMessage)

    expect(mockProcessMessage).toHaveBeenCalledWith('MOCK_KEY', JSON.parse(mockMessage.value))
  })

  test('OK but kafka key mismatch', () => {
    const mockMessage = {
      key: 'MOCK_KEY_KO',
      value: '{"prop1":true,"prop2":"OK"}'
    }
    const mockProcessMessage = jest.fn()
    Business.mockImplementation(() => {
      return {
        processMessage: mockProcessMessage
      }
    })

    const plugin = new Plugin(coreServices, config)
    plugin.worker(mockMessage)

    expect(mockProcessMessage).not.toHaveBeenCalled()
  })
})
