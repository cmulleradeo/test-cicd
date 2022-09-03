import Business from 'brief-product-development-update/brief-product-development-kafka-to-sql/business'

jest.mock('@metric/acl-common-modules')

const { constants } = require('@metric/acl-common-modules')

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

const pluginInfos = {}

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

describe('init()', () => {
  test('OK', async () => {
    const business = new Business(coreServices, pluginInfos, config)

    await expect(business.init()).resolves.toEqual()
  })

  test('KO => failed connectToDatabase()', async () => {
    const connectToDatabase = jest.fn().mockRejectedValue(MOCK_ERROR)
    coreServices.SQL.connectToDatabase = connectToDatabase
    const business = new Business(coreServices, pluginInfos, config)

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
    const business = new Business(coreServices, pluginInfos, config)

    try {
      await business.init()
    } catch (err) {
      expect(err).toBe(MOCK_ERROR)
      expect(coreServices.SQL.connectToDatabase).toHaveBeenCalled()
    }
  })
})

describe('processMessage()', () => {
  test('OK', async () => {
    const business = new Business(coreServices, pluginInfos, config)
    const domain = 'domain'
    const message = { operation: constants.rabbitMqOperations.insert }

    await expect(business.processMessage(domain, message)).resolves.toEqual()
  })
})
