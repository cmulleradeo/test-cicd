import SQLService from './index'
import utils from '../../utils'
import ErrorHandler from '../ErrorHandler'

jest.mock('../Logger')

const { Sequelize, DataTypes } = require('sequelize')

const MOCK_ERROR = new Error('MOCK ERROR')

const pluginInfos = {
  name: 'plugin_test_sql',
  version: '1.0.0'
}
const fakePluginInfos = {
  name: 'fake',
  version: 'fake'
}
const goodSequelize = new Sequelize('mylocaldb', 'postgres', 'password', {
  host: 'localhost',
  port: '5432',
  dialect: 'postgres',
  logging: false
})
beforeEach(() => {
  process.env.DB_TYPE = 'postgres'
  process.env.DB_USER = 'postgres'
  process.env.DB_PWD = 'password'
  process.env.DB_HOST = 'localhost'
  process.env.DB_PORT = '5432'
  process.env.DB_NAME = 'mylocaldb'
  jest.spyOn(Sequelize.prototype, 'authenticate').mockResolvedValue()
})
afterEach(() => {
  jest.restoreAllMocks()
  // eslint-disable-next-line no-undef
  __rewire_reset_all__()
})
describe('SQL : connectToDatabase()', () => {
  test('Function connectToDatabase() : resolved', async () => {
    await expect(SQLService.connectToDatabase(pluginInfos)).resolves.toEqual()
  })
  test('Function connectToDatabase() : rejected while authenticating', async () => {
    Sequelize.prototype.authenticate = jest.fn().mockRejectedValue(MOCK_ERROR)
    try {
      await SQLService.connectToDatabase(pluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toBeTruthy()
    }
  })
  test('Function connectToDatabase() : rejected because an environment variable was not found', async () => {
    process.env.DB_NAME = ''
    try {
      await SQLService.connectToDatabase(pluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.ConfigError).toEqual(true)
    }
  })
})
describe('SQL : closeConnectionToDatabase()', () => {
  beforeEach(() => {
    jest.spyOn(Sequelize.prototype, 'close').mockResolvedValue()
  })
  test('Function closeConnectionToDatabase() : resolved', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    await expect(SQLService.closeConnectionToDatabase(pluginInfos)).resolves.toEqual()
  })
  test('Function closeConnectionToDatabase() : sequelize.close() rejected', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    Sequelize.prototype.close.mockRejectedValue(MOCK_ERROR)

    try {
      await SQLService.closeConnectionToDatabase(pluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
  test('Function closeConnectionToDatabase() : rejected because of no existing sequelize instance for this plugin', async () => {
    try {
      await SQLService.closeConnectionToDatabase(fakePluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
})
describe('SQL : defineModel()', () => {
  test('Function defineModel() : OK', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    const User = SQLService.defineModel(pluginInfos, 'User', {
      id: {
        field: 'id',
        type: SQLService.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lastName: {
        field: 'last_name',
        type: SQLService.DataTypes.STRING
      },
      firstName: {
        field: 'first_name',
        type: SQLService.DataTypes.STRING
      }
    }, {
      freezeTableName: true,
      tableName: 'users',
      createdAt: false,
      updatedAt: false
    })
    const sequelizes = SQLService.__get__('sequelizes')
    const index = utils.findIndex(sequelizes, pluginInfos)

    expect(User).toEqual(sequelizes[parseInt(index)].sequelize.models.User)
  })
  test('Function defineModel() : Error because of no existing sequelize instance for this plugin', async () => {
    try {
      SQLService.defineModel(fakePluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
})
describe('SQL : synchronizeAllModels()', () => {
  beforeEach(() => {
    jest.spyOn(Sequelize.prototype, 'sync').mockResolvedValue()
  })
  test('Function synchronizeAllModels() : resolved', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    await expect(SQLService.synchronizeAllModels(pluginInfos)).resolves.toEqual()
  })
  test('Function synchronizeAllModels() : sequelize.sync() rejected', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    Sequelize.prototype.sync.mockRejectedValue(MOCK_ERROR)

    try {
      await SQLService.synchronizeAllModels(pluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
  test('Function synchronizeAllModels() : rejected because of no existing sequelize instance for this plugin', async () => {
    try {
      await SQLService.synchronizeAllModels(fakePluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
})
describe('SQL : createTransaction()', () => {
  beforeEach(() => {
    jest.spyOn(Sequelize.prototype, 'transaction').mockResolvedValue()
  })
  test('Function createTransaction() : resolved', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    await expect(SQLService.createTransaction(pluginInfos)).resolves.toEqual()
  })
  test('Function createTransaction() : sequelize.transaction() rejected', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    Sequelize.prototype.transaction.mockRejectedValue(MOCK_ERROR)

    try {
      await SQLService.createTransaction(pluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
  test('Function createTransaction() : rejected because of no existing sequelize instance for this plugin', async () => {
    try {
      await SQLService.createTransaction(fakePluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
})
describe('SQL : rawQuery()', () => {
  beforeEach(() => {
    jest.spyOn(Sequelize.prototype, 'query').mockResolvedValue()
  })
  test('Function rawQuery() : resolved', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    await expect(SQLService.rawQuery(pluginInfos)).resolves.toEqual()
  })
  test('Function rawQuery() : rejected while querying', async () => {
    // Simule une connexion existante avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    Sequelize.prototype.query.mockRejectedValue(MOCK_ERROR)

    try {
      await SQLService.rawQuery(pluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
  test('Function rawQuery() : rejected because sequelize is null', async () => {
    // Simule une connexion/déconnexion avec rewire
    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: null }])

    try {
      await SQLService.rawQuery(pluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
  test('Function rawQuery() : rejected because of no existing sequelize instance for this plugin', async () => {
    try {
      await SQLService.rawQuery(fakePluginInfos)
    } catch (error) {
      expect(error instanceof ErrorHandler.SqlError).toEqual(true)
    }
  })
})
describe('SQL : getSqlDatabaseStatus()', () => {
  const returnStatus = {}
  beforeEach(() => {
    SQLService.__set__('isSQLUsed', true)
  })

  test('OK - SQL is not used', async () => {
    SQLService.__set__('isSQLUsed', false)
    await expect(SQLService.getSqlDatabaseStatus()).resolves.toBeNull()
  })
  test('OK - SQL connection is UP', async () => {
    returnStatus.status = 'UP'
    returnStatus.details = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      dialect: process.env.DB_TYPE
    }

    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    jest.spyOn(Sequelize.prototype, 'authenticate').mockResolvedValue()
    await expect(SQLService.getSqlDatabaseStatus()).resolves.toEqual(returnStatus)
  })
  test('OK - SQL connection is DOWN ', async () => {
    returnStatus.status = 'DOWN'
    const mockError = 'MockError'
    returnStatus.details = mockError

    SQLService.__set__('sequelizes', [{ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize: goodSequelize }])
    jest.spyOn(Sequelize.prototype, 'authenticate').mockRejectedValue(mockError)
    await expect(SQLService.getSqlDatabaseStatus()).resolves.toEqual(returnStatus)
  })
})

describe('genericModels: httpEvents', () => {
  test('httpEvents - OK get attributes', () => {
    const obj = SQLService.genericModels.httpEventsTable.getAttributes(DataTypes)
    expect(obj).toEqual(expect.any(Object))
    expect(obj.id).toEqual(expect.any(Object))
    expect(obj.request_method).toEqual(expect.any(Object))
    expect(obj.request_url).toEqual(expect.any(Object))
    expect(obj.request_headers).toEqual(expect.any(Object))
    expect(obj.request_body).toEqual(expect.any(Object))
    expect(obj.request_insertion_date).toEqual(expect.any(Object))
    expect(obj.response_code).toEqual(expect.any(Object))
    expect(obj.response_body).toEqual(expect.any(Object))
    expect(obj.response_headers).toEqual(expect.any(Object))
    expect(obj.response_date).toEqual(expect.any(Object))
    expect(obj.nb_of_tries).toEqual(expect.any(Object))
    expect(obj.extracted_time).toEqual(expect.any(Object))
  })
})

describe('genericModels: kafkaEvents', () => {
  test('httpEvents - OK get attributes', () => {
    const obj = SQLService.genericModels.kafkaEventsTable.getAttributes(DataTypes)
    expect(obj).toEqual(expect.any(Object))
    expect(obj.id).toEqual(expect.any(Object))
    expect(obj.key).toEqual(expect.any(Object))
    expect(obj.topic).toEqual(expect.any(Object))
    expect(obj.published_time).toEqual(expect.any(Object))
    expect(obj.extracted_time).toEqual(expect.any(Object))
    expect(obj.headers).toEqual(expect.any(Object))
    expect(obj.json).toEqual(expect.any(Object))
    expect(obj.error_message).toEqual(expect.any(Object))
    expect(obj.error_date).toEqual(expect.any(Object))
  })
})
