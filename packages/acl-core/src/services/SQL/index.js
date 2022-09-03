/**
 * @module services/SQL
 * @description Core service to manage communication with databases (PostgreSQL, MySQL, SQLite, MSSQL).
 * @requires module:services/Logger
 */

import utils from '../../utils'
import Logger from '../Logger'
import util from 'util'
import kafkaEventsTable from './genericModels/kafkaEvents'
import httpEventsTable from './genericModels/httpEvents'
import ErrorHandler from '../ErrorHandler'

const { Sequelize, DataTypes, Op } = require('sequelize')
const genericModels = { kafkaEventsTable, httpEventsTable }

/**
 * Sequelize instances array, each instance representing a database connection (1 instance per plugin).
 */
const sequelizes = []

/**
 * Get the Sequelize instance for the plugin.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @returns {Sequelize} The Sequelize instance.
 * @throws {ErrorHandler.SqlError} If there is no Sequelize instance associated to the plugin.
 */
const getSequelizeInstance = (pluginInfos) => {
  const index = utils.findIndex(sequelizes, pluginInfos)

  if (index !== -1 && sequelizes[parseInt(index)]?.sequelize !== null) {
    return sequelizes[parseInt(index)].sequelize
  } else {
    throw new ErrorHandler.SqlError({
      message: 'No sequelize existing for this plugin',
      ...pluginInfos
    })
  }
}

/**
 * Open the database connection for a plugin.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @param {object} options - Options for the connection. See {@link https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor|Sequelize constructor} for further information.
 */
const connectToDatabase = async (pluginInfos, options = {}) => {
  Logger.debug(`>>>> Entering in SQL.index.connectToDatabase(pluginInfos = ${util.inspect(pluginInfos)})`, { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  if (!process.env.DB_TYPE ||
    !process.env.DB_USER ||
    !process.env.DB_PWD ||
    !process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_NAME) {
    throw new ErrorHandler.ConfigError({
      message: 'Unable to connect to the database: Environment variables not found',
      ...pluginInfos,
      labels: { service: 'SQL' },
      config: {
        DB_USER: process.env.DB_USER,
        DB_PWD: process.env.DB_PWD?.replace(/.*/i, '*********'),
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        DB_TYPE: process.env.DB_TYPE
      }
    })
  }

  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_TYPE,
    logging: false,
    define: {
      hooks: {
        beforeCreate (record) {
          record[0].dataValues.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '')
          record[0].dataValues.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '')
        },
        beforeUpdate (record) {
          record[0].dataValues.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '')
        },
        beforeBulkCreate (record) {
          record.forEach((r) => {
            r.dataValues.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '')
            r.dataValues.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '')
          })
        }
      }
    },
    ...options
  })

  const index = utils.findIndex(sequelizes, pluginInfos)

  if (index !== -1) {
    sequelizes[parseInt(index)].sequelize = sequelize
  } else {
    sequelizes.push({ pluginName: pluginInfos.name, version: pluginInfos.version, sequelize })
  }

  try {
    await sequelize.authenticate()
    Logger.info('Sequelize correctly instantiated and authenticated', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  } catch (err) {
    throw new ErrorHandler.SqlError({
      message: `Unable to connect to the database: ${err.message}`,
      stack: err.stack,
      ...pluginInfos,
      host: `${process.env.DB_HOST}:${process.env.DB_PORT}`,
      database: process.env.DB_NAME,
      dbUser: process.env.DB_USER,
      dbtype: process.env.DB_TYPE
    })
  } finally {
    Logger.debug('<<<< Exiting SQL.index.connectToDatabase()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  }
}

/**
 * Close the database connection for a plugin.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 */
const closeConnectionToDatabase = async (pluginInfos) => {
  Logger.debug(`>>>> Entering in SQL.index.closeConnectionToDatabase(pluginInfos = ${util.inspect(pluginInfos)})`, { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })

  const sequelize = getSequelizeInstance(pluginInfos)
  try {
    await sequelize.close()
  } catch (err) {
    Logger.debug('<<<< Exiting SQL.index.closeConnectionToDatabase()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
    throw new ErrorHandler.SqlError({
      message: `Failed to close the connection to the SQL database: ${err.message}`,
      stack: err.stack,
      ...pluginInfos,
      host: `${sequelize.config.host}:${sequelize.config.port}`,
      database: sequelize.config.database,
      dbUser: sequelize.config.username
    })
  }
  sequelizes[utils.findIndex(sequelizes, pluginInfos)].sequelize = null
  Logger.info('Closed connection to the SQL database', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  Logger.debug('<<<< Exiting SQL.index.closeConnectionToDatabase()', { labels: { service: 'SQL', plugin: pluginInfos.name } })
}

/**
 * Define a new Model (database table representation).
 * See {@link https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-define|Sequelize define() method} for further information.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @param {string} modelName - Name of the Model.
 * @param {object} attributes - Model attributes. For data type please use the exported DataTypes object: {@link https://sequelize.org/master/variable/index.html#static-variable-DataTypes|DataTypes doc}.
 * @param {object} options - Model options.
 * @returns {object} Sequelize Model.
 */
const defineModel = (pluginInfos, modelName, attributes, options) => {
  Logger.debug(`>>>> Entering in SQL.index.defineModel(pluginInfos = ${util.inspect(pluginInfos)}, modelName = ${util.inspect(modelName)}, attributes = ${util.inspect(attributes)}, options = ${util.inspect(options)})`, { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  const sequelize = getSequelizeInstance(pluginInfos)

  Logger.info('Defining a model', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  Logger.debug('<<<< Exiting SQL.index.defineModel()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  return sequelize.define(modelName, attributes, options)
}

/**
 * Synchronize all models and database tables.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {boolean} dropExisting - Truncate the existing tables when syncing the models.
 */
const synchronizeAllModels = async (pluginInfos, dropExisting = false) => {
  Logger.debug(`>>>> Entering in SQL.index.synchronizeAllModels(pluginInfos = ${util.inspect(pluginInfos)})`, { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  const sequelize = getSequelizeInstance(pluginInfos)

  try {
    await sequelize.sync({ alter: true, force: dropExisting })
  } catch (err) {
    Logger.debug('<<<< Exiting SQL.index.synchronizeAllModels()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
    throw new ErrorHandler.SqlError({
      message: `Failed to synchronize with the SQL database: ${err.message}`,
      stack: err.stack,
      ...pluginInfos,
      host: `${sequelize.config.host}:${sequelize.config.port}`,
      database: sequelize.config.database,
      dbUser: sequelize.config.username
    })
  }
  Logger.info('Synchronized all models', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  Logger.debug('<<<< Exiting SQL.index.synchronizeAllModels()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
}

/**
 * Create a new transaction.
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @returns {object} The SQL transaction.
 */
const createTransaction = async (pluginInfos) => {
  Logger.debug(`>>>> Entering in SQL.index.createTransaction(pluginInfos = ${util.inspect(pluginInfos)})`, { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
  const sequelize = getSequelizeInstance(pluginInfos)

  try {
    const transaction = await sequelize.transaction()
    Logger.info('Created a new SQL transaction', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
    Logger.debug('<<<< Exiting SQL.index.createTransaction()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
    return transaction
  } catch (err) {
    Logger.debug('<<<< Exiting SQL.index.createTransaction()', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
    throw new ErrorHandler.SqlError({
      message: `Failed to create a SQL transaction: ${err.message}`,
      stack: err.stack,
      ...pluginInfos,
      host: `${sequelize.config.host}:${sequelize.config.port}`,
      database: sequelize.config.database,
      dbUser: sequelize.config.username
    })
  }
}

/**
 * Perform a raw query (SQL).
 *
 * @param {object} pluginInfos - Information about the calling plugin.
 * @param {string} pluginInfos.name - Calling plugin name.
 * @param {string} pluginInfos.version - Calling plugin version.
 * @param {string} [pluginInfos.stream] - Calling plugin stream name.
 * @param {string} [pluginInfos.feature] - Calling plugin feature.
 * @param {string} query - SQL query.
 * @returns {Promise} Resolved promise returning the query result, rejected with error otherwise.
 */
const rawQuery = async (pluginInfos, query) => {
  const sequelize = getSequelizeInstance(pluginInfos)

  try {
    const res = await sequelize.query(query)
    Logger.info('Performed a raw query', { stream: pluginInfos?.stream, feature: pluginInfos?.feature, labels: { service: 'SQL', plugin: pluginInfos?.name } })
    return res
  } catch (err) {
    throw new ErrorHandler.SqlError({
      message: `Unable to perform raw query: ${err.message}`,
      stack: err.stack,
      ...pluginInfos,
      labels: { service: 'SQL' },
      host: `${sequelize.config.host}:${sequelize.config.port}`,
      database: sequelize.config.database,
      dbUser: sequelize.config.username,
      query
    })
  }
}

export default {
  getSequelizeInstance,
  connectToDatabase,
  closeConnectionToDatabase,
  defineModel,
  synchronizeAllModels,
  createTransaction,
  rawQuery,
  DataTypes,
  Op,
  genericModels
}
