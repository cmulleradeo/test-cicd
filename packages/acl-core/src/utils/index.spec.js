import utils from './index'

beforeEach(() => {
  process.env = {
    KAFKA_HOST: 'mockHost',
    KAFKA_SSL: 'mockssl'
  }
})

describe('Index:', () => {
  describe('findIndex()', () => {
    test('OK - Nominal case', () => {
      const testArray = [{ pluginName: 'plugin_test_sql', version: '1.0.0' }]
      const pluginInfos = {
        name: 'plugin_test_sql',
        version: '1.0.0'
      }
      const index = utils.findIndex(testArray, pluginInfos)
      expect(index).toBe(0)
    })
  })
})

describe('generateLogInfos', () => {
  const MOCK_PLUGIN_NAME = 'PLUGIN_NAME'
  const MOCK_PLUGIN_VERSION = 'PLUGIN_VERSION'
  const MOCK_PLUGIN_STREAM = 'PLUGIN_STREAM'
  const MOCK_PLUGIN_FEATURE = 'PLUGIN_FEATURE'
  const MOCK_LABELS_KEY_VALUE = 'LABEL_VALUE'

  const MOCK_PLUGIN_INFOS = {
    name: MOCK_PLUGIN_NAME,
    version: MOCK_PLUGIN_VERSION,
    stream: MOCK_PLUGIN_STREAM,
    feature: MOCK_PLUGIN_FEATURE
  }

  const MOCK_LOG_LABELS = {
    MOCK_KEY: MOCK_LABELS_KEY_VALUE
  }

  const MOCK_EXCEPTION = new Error('MOCK_ERROR').stack

  test('generateLogInfos OK with all information', () => {
    const expected = {
      feature: MOCK_PLUGIN_FEATURE,
      stream: MOCK_PLUGIN_STREAM,
      labels: {
        plugin: MOCK_PLUGIN_NAME,
        ...MOCK_LOG_LABELS
      },
      exception: MOCK_EXCEPTION
    }
    expect(utils.generateLogInfos(MOCK_PLUGIN_INFOS, MOCK_LOG_LABELS, MOCK_EXCEPTION)).toEqual(expected)
  })

  test('generateLogInfos OK without exception information', () => {
    const expected = {
      feature: MOCK_PLUGIN_FEATURE,
      stream: MOCK_PLUGIN_STREAM,
      labels: {
        plugin: MOCK_PLUGIN_NAME,
        ...MOCK_LOG_LABELS
      },
      exception: null
    }
    expect(utils.generateLogInfos(MOCK_PLUGIN_INFOS, MOCK_LOG_LABELS)).toEqual(expected)
  })

  test('generateLogInfos OK without labels, exception information', () => {
    const expected = {
      feature: MOCK_PLUGIN_FEATURE,
      stream: MOCK_PLUGIN_STREAM,
      labels: {
        plugin: MOCK_PLUGIN_NAME
      },
      exception: null
    }
    expect(utils.generateLogInfos(MOCK_PLUGIN_INFOS)).toEqual(expected)
  })
})
