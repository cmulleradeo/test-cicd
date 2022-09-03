import ConsumerGroup from './ConsumerGroup'
import Datadog from '../Datadog'
import ErrorHandler from '../ErrorHandler'

// It is mandatory to use 'require' to be able to make complete mocks with Jest
const { Kafka } = require('kafkajs')
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')

// Create complete mocks of the libraries
jest.mock('kafkajs')
jest.mock('@kafkajs/confluent-schema-registry')
jest.mock('../Logger')

const mockPluginInfos = {
  name: 'MOCK_PLUGIN_NAME',
  version: 'MOCK_PLUGIN_VERSON'
}

const mockError = new Error('MOCK_ERROR')

const message = { key: 'FORCED KEY', message: 'FORCED MESSAGE', topic: 'topic1' }

const workerQueues = Array.from([{
  topic: 'topic1',
  workerQueue: []
}, {
  topic: 'topic2',
  workerQueue: []
}])

beforeEach(() => {
  Datadog.incrementMetric = jest.fn()
  Datadog.gaugeMetric = jest.fn()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('ConsumerGroup : createWorkerQueue()', () => {
  test('Function createWorkerQueue()', () => {
    const workerQueue = ConsumerGroup.createWorkerQueue(() => {}, 1)
    expect(workerQueue.concurrency).toEqual(1)
  })
})

describe('ConsumerGroup : getQueueIndex()', () => {
  test('Function getQueueIndex()', () => {
    expect(ConsumerGroup.getQueueIndex(workerQueues, message.topic)).toEqual(0)
  })
})

describe('ConsumerGroup : createConsumerGroup()', () => {
  const groupId = 'MOCK_GROUP_ID'

  const workerQueue = {
    push: jest.fn(),
    drain: jest.fn().mockResolvedValue(),
    idle: jest.fn().mockReturnValue(false)
  }

  const topicWorkerQueue = {
    topic: 'MOCK_TOPIC',
    workerQueue
  }

  const kafkaMock = {
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn().mockResolvedValue(),
      pause: jest.fn(),
      resume: jest.fn()
    })
  }

  const registryMock = {
    decode: jest.fn().mockResolvedValue('MOCK_DECODED')
  }

  beforeEach(() => {
    process.env.KAFKA_HOST = 'host'
    process.env.KAFKA_REGISTRY = 'registry'
    process.env.KAFKA_SSL = true
    Kafka.mockReturnValue(kafkaMock)
    SchemaRegistry.mockReturnValue(registryMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Function createConsumerGroup() : OK', async () => {
    await expect(ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)).resolves.toEqual()
  })

  test('Function createConsumerGroup() : Missing kafka host or registry', async () => {
    delete process.env.KAFKA_HOST
    await expect(ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)).rejects.toEqual(new Error('Missing kafka host or registry'))
  })

  test('Function createConsumerGroup() : failed to connect', async () => {
    const subscribeError = 'Topic not found'
    const subscribe = jest.fn().mockResolvedValue()
    const kafkaMockFail = {
      consumer: jest.fn().mockReturnValue({
        connect: jest.fn().mockRejectedValue(subscribeError),
        subscribe,
        run: jest.fn().mockResolvedValue(),
        pause: jest.fn(),
        resume: jest.fn()
      })
    }

    Kafka.mockReturnValue(kafkaMockFail)

    try {
      await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue, topicWorkerQueue], mockPluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.KafkaError).toEqual(true)
      expect(subscribe).not.toHaveBeenCalled()
    }
  })

  test('Function createConsumerGroup() : failed to subscribe to topic', async () => {
    const subscribeError = 'Topic not found'
    const kafkaMockFail = {
      consumer: jest.fn().mockReturnValue({
        connect: jest.fn(),
        subscribe: jest.fn().mockRejectedValue(subscribeError),
        run: jest.fn().mockResolvedValue(),
        pause: jest.fn(),
        resume: jest.fn()
      })
    }

    Kafka.mockReturnValue(kafkaMockFail)

    try {
      await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue, topicWorkerQueue], mockPluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.KafkaError).toEqual(true)
    }
  })

  test('Function consumer.run(): KO generic error', async () => {
    const kafkaMockFail = {
      consumer: jest.fn().mockReturnValue({
        connect: jest.fn(),
        subscribe: jest.fn(),
        run: jest.fn().mockRejectedValue(new Error('MOCK_ERROR')),
        pause: jest.fn(),
        resume: jest.fn()
      })
    }
    Kafka.mockReturnValue(kafkaMockFail)

    await expect(ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)).resolves
  })

  test('Function consumer.run(): KO with KafkaError', async () => {
    const kafkaError = new ErrorHandler.KafkaError({
      message: 'Failed to process the message batch: the topic is missing in the worker queue',
      ...mockPluginInfos,
      kafkaTopic: topicWorkerQueue.topic
    })
    const kafkaMockFail = {
      consumer: jest.fn().mockReturnValue({
        connect: jest.fn(),
        subscribe: jest.fn(),
        run: jest.fn().mockRejectedValue(kafkaError),
        pause: jest.fn(),
        resume: jest.fn()
      })
    }
    Kafka.mockReturnValue(kafkaMockFail)

    await expect(ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)).resolves
  })

  test('Inner function eachBatch() : OK with key decoding with schema registry', async () => {
    // eslint-disable-next-line no-undefined
    const expectedPush = { headers: { id: 'MOCK_ID' }, key: 'MOCK_DECODED', timestamp: undefined, value: 'MOCK_DECODED' }
    await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)

    const mockConsumer = kafkaMock.consumer()
    const eachBatch = mockConsumer.run.mock.calls[0][0].eachBatch

    await expect(eachBatch({
      batch: {
        topic: 'MOCK_TOPIC',
        messages: [{ key: { key1: 'MOCK_KEY' }, value: 'MOCK_VALUE', headers: { id: 'MOCK_ID' } }]
      },
      resolveOffset: jest.fn().mockResolvedValue(),
      heartbeat: jest.fn().mockResolvedValue(),
      isRunning: jest.fn().mockReturnValue(true),
      commitOffsetsIfNecessary: jest.fn(),
      isStale: jest.fn().mockReturnValue(false)
    })).resolves.toEqual()
    expect(workerQueue.push).toHaveBeenCalled()
    expect(workerQueue.push).toHaveBeenCalledWith(expectedPush)
    expect(Datadog.incrementMetric).toHaveBeenCalledTimes(1)
    expect(Datadog.gaugeMetric).toHaveBeenCalledTimes(2)
  })

  test('Inner function eachBatch() : OK with key deconding as String', async () => {
    // eslint-disable-next-line no-undefined
    const expectedPush = { headers: { id: 'MOCK_ID' }, key: 'MOCK_KEY', timestamp: undefined, value: 'MOCK_DECODED' }
    let counter = 0
    SchemaRegistry.mockReturnValue({
      decode: jest.fn().mockImplementation(async () => {
        if (counter < 1) {
          counter = counter + 1
          throw mockError
        } else {
          counter = counter + 1
          return 'MOCK_DECODED'
        }
      })
    })

    await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)
    const mockConsumer = kafkaMock.consumer()
    const eachBatch = mockConsumer.run.mock.calls[0][0].eachBatch

    await expect(eachBatch({
      batch: {
        topic: 'MOCK_TOPIC',
        messages: [{ key: 'MOCK_KEY', value: 'MOCK_VALUE', headers: { id: 'MOCK_ID' } }]
      },
      resolveOffset: jest.fn().mockResolvedValue(),
      heartbeat: jest.fn().mockResolvedValue(),
      isRunning: jest.fn().mockReturnValue(true),
      commitOffsetsIfNecessary: jest.fn(),
      isStale: jest.fn().mockReturnValue(false)
    })).resolves.toEqual()
    expect(workerQueue.push).toHaveBeenCalled()
    expect(workerQueue.push).toHaveBeenCalledWith(expectedPush)
  })

  test('Inner function eachBatch() : OK with value decoding as String', async () => {
    // eslint-disable-next-line no-undefined
    const expectedPush = { headers: { id: 'MOCK_ID' }, key: 'MOCK_KEY', timestamp: undefined, value: 'MOCK_VALUE' }
    SchemaRegistry.mockReturnValue({
      decode: jest.fn().mockRejectedValue(mockError)
    })

    await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos, false)
    const mockConsumer = kafkaMock.consumer()
    const eachBatch = mockConsumer.run.mock.calls[0][0].eachBatch

    await expect(eachBatch({
      batch: {
        topic: 'MOCK_TOPIC',
        messages: [{ key: 'MOCK_KEY', value: 'MOCK_VALUE', headers: { id: 'MOCK_ID' } }]
      },
      resolveOffset: jest.fn().mockResolvedValue(),
      heartbeat: jest.fn().mockResolvedValue(),
      isRunning: jest.fn().mockReturnValue(true),
      commitOffsetsIfNecessary: jest.fn(),
      isStale: jest.fn().mockReturnValue(false)
    })).resolves.toEqual()
    expect(workerQueue.push).toHaveBeenCalled()
    expect(workerQueue.push).toHaveBeenCalledWith(expectedPush)
  })

  test('Inner function eachBatch() : Missing worker queue', async () => {
    await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)

    const mockConsumer = kafkaMock.consumer()
    const eachBatch = mockConsumer.run.mock.calls[0][0].eachBatch

    try {
      eachBatch({
        batch: {
          topic: '',
          messages: ''
        },
        resolveOffset: null,
        heartbeat: null,
        isRunning: null,
        commitOffsetsIfNecessary: null,
        isStale: null
      })
    } catch (error) {
      expect(error instanceof ErrorHandler.KafkaError).toEqual(true)
    }
  })

  test('Inner function eachBatch() : Break during messages for loop', async () => {
    await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)

    const mockConsumer = kafkaMock.consumer()
    const eachBatch = mockConsumer.run.mock.calls[0][0].eachBatch

    await expect(eachBatch({
      batch: {
        topic: 'MOCK_TOPIC',
        messages: ['']
      },
      resolveOffset: null,
      heartbeat: null,
      isRunning: jest.fn().mockReturnValue(true),
      commitOffsetsIfNecessary: jest.fn(),
      isStale: jest.fn().mockReturnValue(true)
    })).resolves.toEqual()
  })

  test('Inner function eachBatch() : Key is null', async () => {
    await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)

    const mockConsumer = kafkaMock.consumer()
    const eachBatch = mockConsumer.run.mock.calls[0][0].eachBatch

    await eachBatch({
      batch: {
        topic: 'MOCK_TOPIC',
        messages: [{ value: 'MOCK VALUE' }]
      },
      resolveOffset: jest.fn().mockResolvedValue(),
      heartbeat: jest.fn().mockResolvedValue(),
      isRunning: jest.fn().mockReturnValue(true),
      commitOffsetsIfNecessary: jest.fn(),
      isStale: jest.fn().mockReturnValue(false)
    })
    expect(workerQueue.push).not.toHaveBeenCalled()
  })

  test('Inner function eachBatch() : Cannot decode value', async () => {
    let counter = 0
    SchemaRegistry.mockReturnValue({
      decode: jest.fn().mockImplementation(async () => {
        if (counter > 0) {
          throw mockError
        } else {
          counter = counter + 1
        }
      })
    })

    await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)

    const mockConsumer = kafkaMock.consumer()
    const eachBatch = mockConsumer.run.mock.calls[0][0].eachBatch

    await eachBatch({
      batch: {
        topic: 'MOCK_TOPIC',
        messages: [{ key: '123', message: null }]
      },
      resolveOffset: jest.fn().mockResolvedValue(),
      heartbeat: jest.fn().mockResolvedValue(),
      isRunning: jest.fn().mockReturnValue(true),
      commitOffsetsIfNecessary: jest.fn(),
      isStale: jest.fn().mockReturnValue(false)
    })
    expect(workerQueue.push).not.toHaveBeenCalled()
  })

  test('Inner function eachBatch() : Error while processing one of the batch message', async () => {
    await ConsumerGroup.createConsumerGroup(groupId, [topicWorkerQueue], mockPluginInfos)

    const mockConsumer = kafkaMock.consumer()
    const eachBatch = mockConsumer.run.mock.calls[0][0].eachBatch
    const heartbeat = jest.fn().mockResolvedValue()

    await eachBatch({
      batch: {
        topic: 'MOCK_TOPIC',
        messages: [{ key: 'MOCK_KEY', value: 'MOCK_VALUE' }]
      },
      resolveOffset: jest.fn().mockRejectedValue(mockError),
      heartbeat,
      isRunning: jest.fn().mockReturnValue(true),
      commitOffsetsIfNecessary: jest.fn(),
      isStale: jest.fn().mockReturnValue(false)
    })
    expect(heartbeat).not.toHaveBeenCalled()
  })
})
