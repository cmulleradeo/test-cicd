import Datadog from './index'
import Logger from '../Logger'

jest.mock('../../utils')
jest.mock('../Logger')

const MOCK_STREAM = 'STREAM'
const MOCK_PROJECT_TANGRAM = 'PROJECT-TANGRAM'
const MOCK_METRIC_NAME = 'MOCK_METRIC'
const MOCK_ERROR_MESSAGE = 'MOCK_ERROR'
const MOCK_ERROR = new Error(MOCK_ERROR_MESSAGE)

const pluginInfos = {}

beforeEach(() => {
  pluginInfos.stream = MOCK_STREAM
  process.env.PROJECT_TANGRAM = MOCK_PROJECT_TANGRAM
})

afterEach(() => {
  // eslint-disable-next-line no-undef
  __rewire_reset_all__()
  Logger.warn.mockReset()
})

describe('incrementMetric()', () => {
  test('incrementMetric: OK send a metric to Datadog', () => {
    const stastDClient = {
      increment: jest.fn()
    }
    Datadog.__set__('StatsDClient', stastDClient)
    Datadog.incrementMetric(pluginInfos, MOCK_METRIC_NAME, 1)

    expect(stastDClient.increment).toHaveBeenCalledTimes(1)
  })

  test('incrementMetric: KO fail to send metric', () => {
    const stastDClient = {
      increment: jest.fn().mockImplementation(() => {
        throw MOCK_ERROR
      })
    }
    Datadog.__set__('StatsDClient', stastDClient)

    expect(() => {
      Datadog.incrementMetric(pluginInfos, MOCK_METRIC_NAME, 1)
    }).toThrow(MOCK_ERROR_MESSAGE)
    expect(stastDClient.increment).toHaveBeenCalledTimes(1)
  })

  test('incrementMetric: KO missing stream information', () => {
    pluginInfos.stream = null
    Datadog.incrementMetric(pluginInfos, MOCK_METRIC_NAME, 1)
    expect(Logger.warn).toHaveBeenCalledTimes(1)
  })
})

describe('incrementCustomMetric()', () => {
  test('incrementCustomMetric: OK send a metric to Datadog', () => {
    const incrementMetric = jest.fn()
    Datadog.__set__('incrementMetric', incrementMetric)

    Datadog.incrementCustomMetric(pluginInfos, MOCK_METRIC_NAME, 1)
    expect(incrementMetric).toHaveBeenCalledTimes(1)
  })

  test('incrementCustomMetric: KO fail to send metric', () => {
    const incrementMetric = jest.fn().mockImplementation(() => {
      throw MOCK_ERROR
    })
    Datadog.__set__('incrementMetric', incrementMetric)

    expect(() => {
      Datadog.incrementCustomMetric(pluginInfos, MOCK_METRIC_NAME, 1)
    }).toThrow(MOCK_ERROR_MESSAGE)
    expect(incrementMetric).toHaveBeenCalledTimes(1)
  })
})

describe('GaugeMetric()', () => {
  test('GaugeMetric: OK send metric', () => {
    const stastDClient = {
      gauge: jest.fn()
    }
    Datadog.__set__('StatsDClient', stastDClient)
    Datadog.gaugeMetric(pluginInfos, MOCK_METRIC_NAME, 1)

    expect(stastDClient.gauge).toHaveBeenCalledTimes(1)
  })

  test('GaugeMetric: KO fail to send metric', () => {
    const stastDClient = {
      gauge: jest.fn().mockImplementation(() => {
        throw MOCK_ERROR
      })
    }
    Datadog.__set__('StatsDClient', stastDClient)

    expect(() => {
      Datadog.gaugeMetric(pluginInfos, MOCK_METRIC_NAME, 1)
    }).toThrow(MOCK_ERROR_MESSAGE)
    expect(stastDClient.gauge).toHaveBeenCalledTimes(1)
  })

  test('gaugeMetric: KO missing stream information', () => {
    pluginInfos.stream = null
    Datadog.gaugeMetric(pluginInfos, MOCK_METRIC_NAME, 1)
    expect(Logger.warn).toHaveBeenCalledTimes(1)
  })
})

describe('gaugeCustomMetric()', () => {
  test('GaugeCustomMetric: OK send metric', () => {
    const gaugeMetric = jest.fn()
    Datadog.__set__('gaugeMetric', gaugeMetric)

    Datadog.gaugeCustomMetric(pluginInfos, MOCK_METRIC_NAME, 1)

    expect(gaugeMetric).toHaveBeenCalledTimes(1)
  })

  test('GaugeCustomMetric: KO fail to send metric', () => {
    const gaugeMetric = jest.fn().mockImplementation(() => {
      throw MOCK_ERROR
    })
    Datadog.__set__('gaugeMetric', gaugeMetric)

    expect(() => {
      Datadog.gaugeCustomMetric(pluginInfos, MOCK_METRIC_NAME, 1)
    }).toThrow(MOCK_ERROR_MESSAGE)
    expect(gaugeMetric).toHaveBeenCalledTimes(1)
  })
})
