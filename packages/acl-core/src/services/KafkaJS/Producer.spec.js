import util from 'util'
import Producer from './Producer'
import Logger from '../Logger'
import Datadog from '../Datadog'
import ErrorHandler from '../ErrorHandler'

const { Kafka } = require('kafkajs')
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')

jest.mock('kafkajs')
jest.mock('@kafkajs/confluent-schema-registry')

const MOCK_ERROR = new Error('MOCK ERROR')

const pluginInfos = {
  name: 'MOCK_PLUGIN',
  version: '1.0.0'
}

afterEach(() => {
  jest.restoreAllMocks()
})

beforeEach(() => {
  Producer.__set__('producers', [])
  Producer.__set__('registries', [])

  Kafka.mockClear()
  SchemaRegistry.mockClear()

  Logger.debug = jest.fn()
  Logger.info = jest.fn()
  Logger.error = jest.fn()

  Datadog.incrementMetric = jest.fn()
  Datadog.gaugeMetric = jest.fn()
})

describe('Producer :', () => {
  describe('KafkaJS/Producer : bindSchemaInfo()', () => {
    test('OK', () => {
      const bindSchemaInfo = Producer.__get__('bindSchemaInfo')
      const expectedResult = {
        schemaId: 'id',
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        topic: 'topic'
      }
      expect(bindSchemaInfo('id', pluginInfos, 'topic')).toEqual(expectedResult)
    })
  })

  describe('checkPluginInfos()', () => {
    const checkPluginInfos = Producer.__get__('checkPluginInfos')
    test('OK - PluginInfo is valid', async () => {
      const mockPluginInfo = {
        name: 'mockName',
        version: 'mockVersion'
      }
      expect(() => { checkPluginInfos(mockPluginInfo) }).not.toThrow()
    })
    test('KO - PluginInfo.version & PluginInfo.name missing', async () => {
      const mockPluginInfo = {}
      expect(() => { checkPluginInfos(mockPluginInfo) }).toThrow()
    })
  })

  describe('createProducer()', () => {
    beforeEach(() => {
      process.env.KAFKA_HOST = 'host'
      process.env.KAFKA_REGISTRY = 'registry'
      process.env.KAFKA_SSL = 'ssl'
    })

    test('KO - Missing kafka host or registry', async () => {
      delete process.env.KAFKA_HOST
      await expect(Producer.createProducer(pluginInfos)).rejects.toEqual(new Error('Missing kafka host or registry'))
    })

    test('OK - with new Producer and Registry', async () => {
      const mockProducer = {
        connect: jest.fn()
      }
      Kafka.mockImplementation(() => {
        return {
          producer: () => mockProducer
        }
      })

      await expect(Producer.createProducer(pluginInfos)).resolves.toEqual()
      const producers = Producer.__get__('producers')

      expect(producers[0].producer).toEqual(mockProducer)
      expect(Kafka).toHaveBeenCalledTimes(1)
      expect(SchemaRegistry).toHaveBeenCalledTimes(1)
    })

    test('OK - with new Producer and Registry and no ssl', async () => {
      const mockProducer = {
        connect: jest.fn()
      }

      delete process.env.KAFKA_SSL

      Kafka.mockImplementation(() => {
        return {
          producer: () => mockProducer
        }
      })

      await expect(Producer.createProducer(pluginInfos)).resolves.toEqual()
      const producers = Producer.__get__('producers')

      expect(producers[0].producer).toEqual(mockProducer)
      expect(Kafka).toHaveBeenCalledTimes(1)
      expect(SchemaRegistry).toHaveBeenCalledTimes(1)
    })

    test('OK - with already existing Producer and Registry', async () => {
      const producers = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version
      }]
      Producer.__set__('producers', producers)

      const registries = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version
      }]
      Producer.__set__('registries', registries)

      const mockProducer = {
        connect: jest.fn()
      }
      Kafka.mockImplementation(() => {
        return {
          producer: () => mockProducer
        }
      })

      await expect(Producer.createProducer(pluginInfos)).resolves.toEqual()

      expect(Kafka).toHaveBeenCalledTimes(1)
      expect(SchemaRegistry).toHaveBeenCalledTimes(1)
    })

    test('KO - Failed to create producer', async () => {
      Kafka.mockImplementation(() => {
        return {
          producer: () => {
            throw MOCK_ERROR
          }
        }
      })
      const error = new Error(`Failed to connect to the Kafka broker: ${MOCK_ERROR.message}`)
      await expect(Producer.createProducer(pluginInfos)).rejects.toEqual(error)
    })
  })
  describe('getKeySchemaId()', () => {
    let registry
    let keysSchema
    beforeEach(() => {
      registry = {
        getLatestSchemaId: jest.fn().mockResolvedValue({})
      }
      keysSchema = [{
        schemaId: 'mockSchemaId',
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        topic: 'mockTopic'
      }]
    })
    test('OK - Nominal case return existing key schema', async () => {
      const bindSchemaInfo = jest.fn().mockResolvedValue(keysSchema[0])
      const getKeySchemaId = Producer.__get__('getKeySchemaId')
      Producer.__set__('bindSchemaInfo', bindSchemaInfo)
      Producer.__set__('keysSchema', keysSchema)

      await expect(getKeySchemaId('mockTopic', registry, pluginInfos)).resolves.toEqual(keysSchema[0].schemaId)
      const expectedKeysSchema = Producer.__get__('keysSchema')
      expect(bindSchemaInfo).not.toHaveBeenCalled()
      expect(registry.getLatestSchemaId).not.toHaveBeenCalled()
      expect(expectedKeysSchema).toEqual(keysSchema)
    })
    test('OK - add new schema key', async () => {
      keysSchema = []
      const expectedKeysSchema = [{
        schemaId: 'mockSchemaId',
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        topic: 'mockTopic'
      }]
      const getKeySchemaId = Producer.__get__('getKeySchemaId')
      const bindSchemaInfo = jest.fn().mockReturnValue(expectedKeysSchema[0])
      Producer.__set__('bindSchemaInfo', bindSchemaInfo)
      Producer.__set__('keysSchema', keysSchema)

      await expect(getKeySchemaId('mockTopic', registry, pluginInfos)).resolves.toEqual(expectedKeysSchema[0].schemaId)
      expect(Producer.__get__('keysSchema', keysSchema)).toEqual(expectedKeysSchema)
      expect(bindSchemaInfo).toHaveBeenCalledTimes(1)
      expect(registry.getLatestSchemaId).toHaveBeenCalledTimes(1)
    })
    test('KO - error with bindSchemaInfo', async () => {
      keysSchema = []
      const bindSchemaInfo = jest.fn().mockImplementation(() => { throw MOCK_ERROR })
      const getKeySchemaId = Producer.__get__('getKeySchemaId')
      Producer.__set__('keysSchema', keysSchema)
      Producer.__set__('bindSchemaInfo', bindSchemaInfo)
      const error = new Error(`Error in getKeySchemaId: ${MOCK_ERROR.message}`)
      await expect(getKeySchemaId('mockTopic', registry, pluginInfos)).rejects.toEqual(error)
      expect(registry.getLatestSchemaId).toHaveBeenCalledTimes(1)
      expect(bindSchemaInfo).toHaveBeenCalledTimes(1)
    })
  })

  describe('getValueSchemaId()', () => {
    let registry
    let valuesSchema
    beforeEach(() => {
      registry = {
        getLatestSchemaId: jest.fn().mockResolvedValue({})
      }
      valuesSchema = [{
        schemaId: 'mockSchemaId',
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        topic: 'mockTopic'
      }]
    })
    test('OK - Nominal case return existing value schema', async () => {
      const bindSchemaInfo = jest.fn().mockResolvedValue(valuesSchema[0])
      const getValueSchemaId = Producer.__get__('getValueSchemaId')
      Producer.__set__('bindSchemaInfo', bindSchemaInfo)
      Producer.__set__('valuesSchema', valuesSchema)

      await expect(getValueSchemaId('mockTopic', registry, pluginInfos)).resolves.toEqual(valuesSchema[0].schemaId)
      const expectedValuesSchema = Producer.__get__('valuesSchema')
      expect(bindSchemaInfo).not.toHaveBeenCalled()
      expect(registry.getLatestSchemaId).not.toHaveBeenCalled()
      expect(expectedValuesSchema).toEqual(valuesSchema)
    })
    test('OK - add new schema value', async () => {
      valuesSchema = []
      const expectedValuesSchema = [{
        schemaId: 'mockSchemaId',
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        topic: 'mockTopic'
      }]
      const getValueSchemaId = Producer.__get__('getValueSchemaId')
      const bindSchemaInfo = jest.fn().mockReturnValue(expectedValuesSchema[0])
      Producer.__set__('bindSchemaInfo', bindSchemaInfo)
      Producer.__set__('valuesSchema', valuesSchema)

      await expect(getValueSchemaId('mockTopic', registry, pluginInfos)).resolves.toEqual(expectedValuesSchema[0].schemaId)
      expect(bindSchemaInfo).toHaveBeenCalledTimes(1)
      expect(registry.getLatestSchemaId).toHaveBeenCalledTimes(1)
    })

    test('KO - error with bindSchemaInfo', async () => {
      valuesSchema = []
      const bindSchemaInfo = jest.fn().mockImplementation(() => { throw MOCK_ERROR })
      const getValueSchemaId = Producer.__get__('getValueSchemaId')
      Producer.__set__('valuesSchema', valuesSchema)
      Producer.__set__('bindSchemaInfo', bindSchemaInfo)
      const error = new Error(`Error in getValueSchemaId: ${MOCK_ERROR.message}`)
      await expect(getValueSchemaId('mockTopic', registry, pluginInfos)).rejects.toEqual(error)
      expect(registry.getLatestSchemaId).toHaveBeenCalledTimes(1)
      expect(bindSchemaInfo).toHaveBeenCalledTimes(1)
    })
  })

  describe('sendMessage()', () => {
    test('OK - Success', async () => {
      const producers = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        producer: {
          send: jest.fn().mockResolvedValue()
        }
      }]
      const registries = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        registry: {
          getLatestSchemaId: jest.fn().mockResolvedValue(),
          encode: jest.fn().mockResolvedValue()
        }
      }]
      const getKeySchemaId = jest.fn().mockResolvedValue('mockKeySchemaId')
      const valueSchema = jest.fn().mockResolvedValue('mockValueSchemaId')
      Producer.__set__('getKeySchemaId', getKeySchemaId)
      Producer.__set__('getValueSchemaId', valueSchema)
      Producer.__set__('registries', registries)
      Producer.__set__('producers', producers)

      await expect(Producer.sendMessage({ key: 'MOCK_KEY', messages: [{}], headers: { id: 'MOCK_ID' } }, pluginInfos)).resolves.toEqual()
      expect(Datadog.incrementMetric).toHaveBeenCalledTimes(1)
      expect(Datadog.gaugeMetric).toHaveBeenCalledTimes(2)
    })

    test('OK - Success via EventBroker', async () => {
      const mockProducer = {
        connect: jest.fn()
      }
      Kafka.mockImplementation(() => {
        return {
          producer: () => mockProducer
        }
      })

      const pluginInfosEvent = { name: 'MOCK_PLUGIN_EVENT', version: '1.0.0' }
      await expect(Producer.createProducer(pluginInfosEvent)).resolves.toEqual()

      const oldSendMessage = Producer.__get__('sendMessage')
      const sendMessage = jest.fn().mockResolvedValue()
      const getKeySchemaId = jest.fn().mockResolvedValue('mockKeySchemaId')
      const valueSchema = jest.fn().mockResolvedValue('mockValueSchemaId')
      Producer.__set__('getKeySchemaId', getKeySchemaId)
      Producer.__set__('getKeySchemaId', valueSchema)
      Producer.__set__('sendMessage', sendMessage)

      expect(sendMessage).toHaveBeenCalledTimes(1)
      Producer.__set__('sendMessage', oldSendMessage)
    })

    test('NOK - Cannot get producer instance', async () => {
      const getKeySchemaId = jest.fn().mockResolvedValue('mockKeySchemaId')
      const valueSchema = jest.fn().mockResolvedValue('mockValueSchemaId')
      Producer.__set__('getKeySchemaId', getKeySchemaId)
      Producer.__set__('getKeySchemaId', valueSchema)

      try {
        await Producer.closeProducer(pluginInfos)
      } catch (error) {
        await expect(error instanceof ErrorHandler.MetricBaseError).toEqual(true)
      }
    })

    test('NOK - Cannot found registry instance', async () => {
      const producers = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        producer: {
        }
      }]
      const getKeySchemaId = jest.fn().mockResolvedValue('mockKeySchemaId')
      const getValueSchemaId = jest.fn().mockResolvedValue('mockValueSchemaId')
      Producer.__set__('getKeySchemaId', getKeySchemaId)
      Producer.__set__('getValueSchemaId', getValueSchemaId)
      Producer.__set__('producers', producers)

      try {
        await Producer.sendMessage({}, pluginInfos)
      } catch (err) {
        expect(err instanceof ErrorHandler.MetricBaseError).toEqual(true)
      }
    })

    test('NOK - Cannot get schema', async () => {
      const producers = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        producer: {
        }
      }]
      Producer.__set__('producers', producers)

      const registries = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        registry: {
          getLatestSchemaId: jest.fn()
        }
      }]
      const getKeySchemaId = jest.fn().mockResolvedValue('mockKeySchemaId')
      const getValueSchemaId = jest.fn().mockRejectedValue(MOCK_ERROR)
      Producer.__set__('getKeySchemaId', getKeySchemaId)
      Producer.__set__('getValueSchemaId', getValueSchemaId)
      Producer.__set__('registries', registries)
      await expect(Producer.sendMessage({}, pluginInfos)).rejects.toEqual(MOCK_ERROR)
    })

    test('KO - Cannot encode key', async () => {
      const key = { data: 'key' }
      const mockError = new Error(`Failed to encode key: ${util.inspect(key)}`)
      const producers = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        producer: {
        }
      }]
      Producer.__set__('producers', producers)

      const registries = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        registry: {
          getLatestSchemaId: jest.fn().mockResolvedValue(),
          encode: jest.fn().mockRejectedValue(mockError)
        }
      }]
      const getKeySchemaId = jest.fn().mockResolvedValue('mockKeySchemaId')
      const valueSchema = jest.fn().mockResolvedValue('mockValueSchemaId')
      Producer.__set__('getKeySchemaId', getKeySchemaId)
      Producer.__set__('getValueSchemaId', valueSchema)
      Producer.__set__('registries', registries)
      await expect(Producer.sendMessage({ key, messages: [{ data: 1 }, { data: 2 }], headers: { id: 'MOCK_ID' } }, pluginInfos)).rejects.toEqual(mockError)
    })

    test('KO - Cannot encode one of values', async () => {
      let counter = 0
      const messages = [{ data: 1 }, { data: 2 }]
      const mockError = new Error(`Failed to encode value: ${util.inspect(messages[1])}`)
      const producers = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        producer: {
        }
      }]
      Producer.__set__('producers', producers)

      const registries = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        registry: {
          getLatestSchemaId: jest.fn().mockResolvedValue(),
          encode: jest.fn().mockImplementation(async () => {
            if (counter > 2) {
              throw mockError
            } else {
              counter = counter + 1
            }
          })
        }
      }]
      const getKeySchemaId = jest.fn().mockResolvedValue('mockKeySchemaId')
      const valueSchema = jest.fn().mockResolvedValue('mockValueSchemaId')
      Producer.__set__('getKeySchemaId', getKeySchemaId)
      Producer.__set__('getValueSchemaId', valueSchema)
      Producer.__set__('registries', registries)
      await expect(Producer.sendMessage({ key: { data: 'key' }, messages, headers: { id: 'MOCK_ID' } }, pluginInfos)).rejects.toEqual(mockError)
    })

    test('NOK - cannot send messages', async () => {
      const mockError = new Error(`Failed to send messages: ${MOCK_ERROR.message}`)
      const producers = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        producer: {
          send: jest.fn().mockRejectedValue(MOCK_ERROR)
        }
      }]
      Producer.__set__('producers', producers)

      const registries = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        registry: {
          getLatestSchemaId: jest.fn().mockResolvedValue(),
          encode: jest.fn().mockResolvedValue()
        }
      }]
      const getKeySchemaId = jest.fn().mockResolvedValue('mockKeySchemaId')
      const valueSchema = jest.fn().mockResolvedValue('mockValueSchemaId')
      Producer.__set__('getKeySchemaId', getKeySchemaId)
      Producer.__set__('getKeySchemaId', valueSchema)
      Producer.__set__('registries', registries)
      await expect(Producer.sendMessage({ key: { data: 'key' }, messages: [{ data: 1 }, { data: 2 }], headers: { id: 'MOCK_ID' } }, pluginInfos)).rejects.toEqual(mockError)
    })
  })

  describe('sendMessageInJson()', () => {
    test('OK - Success', async () => {
      const producers = [{
        pluginName: pluginInfos.name,
        version: pluginInfos.version,
        producer: {
          send: jest.fn().mockResolvedValue()
        }
      }]
      Producer.__set__('producers', producers)

      const payload = {
        key: 'MOCK_KEY',
        messages: [{}],
        headers: { id: 'MOCK_ID' }
      }

      await expect(Producer.sendMessageInJson(payload, pluginInfos)).resolves.toEqual()
      expect(Datadog.incrementMetric).toHaveBeenCalledTimes(1)
      expect(Datadog.gaugeMetric).toHaveBeenCalledTimes(2)
    })
  })

  describe('closeProducer()', () => {
    test('OK - Success', async () => {
      const producers = [
        {
          pluginName: pluginInfos.name,
          version: pluginInfos.version,
          producer: {
            disconnect: jest.fn().mockResolvedValue()
          }
        }
      ]
      Producer.__set__('producers', producers)

      await expect(Producer.closeProducer(pluginInfos)).resolves.toEqual()
    })
    test('NOK - Unknown producer for this plugin', async () => {
      const mockError = new Error('No producer instance for the plugin')

      await expect(Producer.closeProducer(pluginInfos)).rejects.toEqual(mockError)
    })

    test('KO - Catching error', async () => {
      const producers = [
        {
          pluginName: pluginInfos.name,
          version: pluginInfos.version,
          producer: {
            disconnect: jest.fn().mockRejectedValue(MOCK_ERROR)
          }
        }
      ]

      Producer.__set__('producers', producers)
      const error = new Error(`Failed to close the producer: ${MOCK_ERROR.message}`)
      await expect(Producer.closeProducer(pluginInfos)).rejects.toEqual(error)
    })
  })
})
