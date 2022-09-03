import BriefProductDevelopmentBusiness from 'brief-product-development-init/api-to-sql-brief-product-development/business/BriefProductDevelopmentBusiness'

jest.mock('@metric/acl-common-modules')
jest.mock('@metric/acl-init-modules')

const MOCK_ERROR = new Error('MOCK_ERROR')

const config = {
  STREAM: 'STREAM',
  PLUGIN_NAME: 'PLUGIN_NAME'
}

let coreServices
const Logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

const logInfos = {}

beforeEach(() => {
  require('@metric/acl-common-modules').__initMocks__()

  coreServices = {
    SQL: {
      connectToDatabase: jest.fn().mockResolvedValue(),
      getSequelizeInstance: jest.fn(),
      synchronizeAllModels: jest.fn().mockResolvedValue()
    },
    Logger
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('init', () => {
  test('OK', async () => {
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)

    await expect(business.init()).resolves.toEqual()
  })

  test('KO => failed connectToDatabase()', async () => {
    const connectToDatabase = jest.fn().mockRejectedValue(MOCK_ERROR)
    coreServices.SQL.connectToDatabase = connectToDatabase
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)

    try {
      await business.init()
    } catch (err) {
      expect(err).toBe(MOCK_ERROR)
      expect(coreServices.SQL.synchronizeAllModels).not.toHaveBeenCalled()
    }
  })

  test('KO => failed synchronizeAllModels()', async () => {
    const connectToDatabase = jest.fn().mockRejectedValue(MOCK_ERROR)
    coreServices.SQL.synchronizeAllModels = connectToDatabase
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)

    try {
      await business.init()
    } catch (err) {
      expect(err).toBe(MOCK_ERROR)
      expect(coreServices.SQL.connectToDatabase).toHaveBeenCalled()
    }
  })
})

describe('getCollections', () => {
  test('OK', async () => {
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)
    await business.init()

    await expect(business.getCollections()).resolves.toEqual()

    const apiResponse = require('@metric/acl-init-modules').__getCollections__()
    const database = require('@metric/acl-common-modules').__getDatabase__()

    expect(apiResponse.length).toEqual(2)
    expect(database.length).toEqual(1)
    expect(database[0].$id).toEqual(9730422)
  })

  test('KO => failed upsertBatch()', async () => {
    require('@metric/acl-common-modules').__breakUpsertBatch__(MOCK_ERROR)
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)
    await business.init()

    await expect(business.getCollections()).rejects.toEqual(new Error(`Failed to insert the Collection: ${MOCK_ERROR.message}`))
  })
})

describe('getMerchCollectionVersions', () => {
  test('OK', async () => {
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)
    await business.init()

    await expect(business.getMerchCollectionVersions()).resolves.toEqual()

    const apiResponse = require('@metric/acl-init-modules').__getMerchCollectionVersions__()
    const database = require('@metric/acl-common-modules').__getDatabase__()

    expect(apiResponse.length).toEqual(2)
    expect(database.length).toEqual(2)
    expect(database.some((element) => element.$id === 9730588)).toEqual(true)
  })

  test('KO => failed upsertBatch()', async () => {
    require('@metric/acl-common-modules').__breakUpsertBatch__(MOCK_ERROR)
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)
    await business.init()

    await expect(business.getMerchCollectionVersions()).rejects.toEqual(new Error(`Failed to insert the Merch Collection Version: ${MOCK_ERROR.message}`))
  })
})

describe('getMerchSecondaryVersions', () => {
  test('OK', async () => {
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)
    await business.init()

    await expect(business.getMerchSecondaryVersions()).resolves.toEqual()

    const apiResponse = require('@metric/acl-init-modules').__getMerchCollectionVersions__()
    const database = require('@metric/acl-common-modules').__getDatabase__()

    expect(apiResponse.length).toEqual(2)
    expect(database.length).toEqual(2)
    expect(database.some((element) => element.$id === 9744199)).toEqual(true)
  })

  test('KO => failed upsertBatch()', async () => {
    require('@metric/acl-common-modules').__breakUpsertBatch__(MOCK_ERROR)
    const business = new BriefProductDevelopmentBusiness(coreServices.Logger, logInfos, config, coreServices.SQL)
    await business.init()

    await expect(business.getMerchSecondaryVersions()).rejects.toEqual(new Error(`Failed to insert the Merch Secondary Version: ${MOCK_ERROR.message}`))
  })
})
