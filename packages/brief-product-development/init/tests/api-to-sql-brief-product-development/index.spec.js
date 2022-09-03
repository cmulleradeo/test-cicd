import ApiToSql from 'brief-product-development-init/api-to-sql-brief-product-development'
import BriefProductDevelopmentBusiness from 'brief-product-development-init/api-to-sql-brief-product-development/business/BriefProductDevelopmentBusiness'
import jsonExpectedSampleConfig from 'brief-product-development-init/api-to-sql-brief-product-development/sample_config.json'

jest.mock('brief-product-development-init/api-to-sql-brief-product-development/business/BriefProductDevelopmentBusiness')

const MOCK_ERROR = new Error('MOCK_ERROR')

const config = {
  STREAM: 'STREAM',
  PLUGIN_NAME: 'PLUGIN_NAME'
}

const coreServices = {
  SQL: {},
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}

beforeEach(() => {
  BriefProductDevelopmentBusiness.mockClear()
})

describe('getJsonSampleConfig()', () => {
  test('Function getJsonSampleConfig(): OK', () => {
    const received = ApiToSql.getJsonSampleConfig()
    expect(received).toEqual(jsonExpectedSampleConfig)
  })
})

describe('getPrefixEnv and setPrefixEnv', () => {
  test('OK default value', () => {
    const plugin = new ApiToSql(coreServices, config)

    expect(plugin.getPrefixEnv()).toEqual('API_TO_SQL')
  })

  test('OK new value', () => {
    const plugin = new ApiToSql(coreServices, config)
    plugin.setPrefixEnv('MOCK_PREFIX')

    expect(plugin.getPrefixEnv()).toEqual('MOCK_PREFIX')
  })
})

describe('start', () => {
  test('OK', async () => {
    BriefProductDevelopmentBusiness.mockImplementation(() => {
      return {
        init: jest.fn().mockResolvedValue(),
        getBriefProductDevelopmentBusinessTerm: jest.fn().mockResolvedValue()
      }
    })
    const plugin = new ApiToSql(coreServices, config)

    await expect(plugin.start()).resolves.toEqual()
  })

  test('KO => failed business.init()', async () => {
    const getBriefProductDevelopmentBusinessTerm = jest.fn().mockResolvedValue()
    BriefProductDevelopmentBusiness.mockImplementation(() => {
      return {
        init: jest.fn().mockRejectedValue(MOCK_ERROR),
        getBriefProductDevelopmentBusinessTerm
      }
    })
    const plugin = new ApiToSql(coreServices, config)

    try {
      await plugin.start()
    } catch (err) {
      expect(err).toBe(MOCK_ERROR)
      expect(getBriefProductDevelopmentBusinessTerm).not.toHaveBeenCalled()
    }
  })

  test('KO => failed business.getBriefProductDevelopmentBusinessTerm()', async () => {
    const getBriefProductDevelopmentBusinessTerm = jest.fn().mockRejectedValue(MOCK_ERROR)
    BriefProductDevelopmentBusiness.mockImplementation(() => {
      return {
        init: jest.fn().mockResolvedValue(),
        getBriefProductDevelopmentBusinessTerm
      }
    })
    const plugin = new ApiToSql(coreServices, config)

    try {
      await plugin.start()
    } catch (err) {
      expect(err).toBe(MOCK_ERROR)
      expect(getBriefProductDevelopmentBusinessTerm).toHaveBeenCalled()
    }
  })
})
