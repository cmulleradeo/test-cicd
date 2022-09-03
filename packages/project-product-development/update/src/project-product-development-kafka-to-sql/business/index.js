import util from 'util'

import {
  generateLogInfos,
  sqlModels,
  constants,
  mappers,
  SqlHelper
} from '@metric/acl-common-modules'

const { CollectionModel } = sqlModels

export default class Business {
  constructor (coreServices, pluginInfos, config) {
    this.pluginInfos = pluginInfos
    this.config = config

    this.sql = coreServices.SQL
    this.logger = coreServices.Logger
    this.SqlHelper = new SqlHelper(config, this.logger, this.logInfos)

    this.mapper = new mappers.CollectionMapper()
  }

  /**
   * Initialize the database connection and models.
   */
  init = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.initDatabase()`, generateLogInfos(this.pluginInfos))

    const postgreOptions = {
      dialectOptions: {
        ssl: {
          require: this.config.SQL_USE_SSL,
          rejectUnauthorized: false
        },
        keepAlive: true
      }
    }
    await this.sql.connectToDatabase(this.pluginInfos, postgreOptions)

    this.collectionModel = CollectionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    await this.sql.synchronizeAllModels(this.pluginInfos)

    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.initDatabase()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Process the message concerning ProjectProductDevelopment received from Kafka.
   *
   * @param {object} projectProductDevelopment The new attributes to update.
   * @param {number} projectProductDevelopment.id Identifier of the entity to update.
   * @param {number} projectProductDevelopment.operation Type of operation (INSERT, UPDATE, DELETE).
   * @param {object[]} projectProductDevelopment.attributes Array containing the modifier attributes.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  processProjectProductDevelopment = async (projectProductDevelopment, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.processProjectProductDevelopment(projectProductDevelopment=${projectProductDevelopment})`, generateLogInfos(this.pluginInfos))
    if (!projectProductDevelopment) {
      throw new Error('ProjectProductDevelopment message is null')
    }

    // Ignore the group projects or if it has the status Postponed(ADEO_ProjectStatus:3) and Cancelled(ADEO_ProjectStatus:2)
    if (projectProductDevelopment.ADEO_Collection_ProjectGroup_boolean ||
      projectProductDevelopment.ADEO_Collection_ProjectStatus_enum === 'ADEO_ProjectStatus:3' ||
      projectProductDevelopment.ADEO_Collection_ProjectStatus_enum === 'ADEO_ProjectStatus:2') {
      this.logger.info('Received a message for a group project or a cancelled or postponed project', generateLogInfos(this.pluginInfos))
      return
    }
    if (typeof (projectProductDevelopment) === 'string') {
      projectProductDevelopment = JSON.parse(projectProductDevelopment)
    }

    const logLabels = generateLogInfos(this.pluginInfos)
    switch (projectProductDevelopment.operation) {
      case constants.rabbitMqOperations.insert:
        await this.insertProjectProductDevelopment(projectProductDevelopment)
        break
      case constants.rabbitMqOperations.update:
        await this.updateProjectProductDevelopment(projectProductDevelopment)
        break
      case constants.rabbitMqOperations.delete:
        await this.deleteProjectProductDevelopment(projectProductDevelopment.id)
        break
      default:
        logLabels.labels.message = JSON.stringify(projectProductDevelopment)
        this.logger.warn(`Received a message with an unexpected operation: ${projectProductDevelopment.operation}`, logLabels)
        break
    }
    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.processProjectProductDevelopment()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Insert a new ProjectProductDevelopment into the database.
   *
   * @param {object} projectProductDevelopment The new attributes to update.
   * @param {number} projectProductDevelopment.id Identifier of the entity to update.
   * @param {object[]} projectProductDevelopment.attributes Array containing the modified attributes.
   */
  insertProjectProductDevelopment = async (projectProductDevelopment) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.insertProjectProductDevelopment(projectProductDevelopment)})`, generateLogInfos(this.pluginInfos))

    try {
      const entity = this.mapper.convertMessageToAclData(projectProductDevelopment)
      await this.SqlHelper.upsertBatch(this.collectionModel, [entity])
      this.logger.info(`Inserted new entity with id ${projectProductDevelopment.id} in the database`, generateLogInfos(this.pluginInfos))
    } catch (err) {
      this.logger.error(
        `Failed to INSERT the SQL entity for the following reason: ${err.message}`,
        generateLogInfos(this.pluginInfos, { projectProductDevelopment }, err))
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.insertProjectProductDevelopment()`, generateLogInfos(this.pluginInfos))
    }
  }

  /**
   * Update an existing ProjectProductDevelopment from the database.
   *
   * @param {object} projectProductDevelopment The new attributes to update.
   * @param {number} projectProductDevelopment.id Identifier of the entity to update.
   * @param {object[]} projectProductDevelopment.attributes Array containing the modifier attributes.
   */
  updateProjectProductDevelopment = async (projectProductDevelopment) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.updateProjectProductDevelopment(projectProductDevelopment=${util.inspect(projectProductDevelopment)})`, generateLogInfos(this.pluginInfos))
    const existingProjectProduct = await this.collectionModel.findByPk(projectProductDevelopment.id)

    if (!existingProjectProduct) {
      this.logger.error(`Unable to find an existing ProjectProductDevelopment to UPDATE with id: ${projectProductDevelopment.id}`, generateLogInfos(this.pluginInfos))
      return
    }

    const convertedData = this.mapper.convertMessageToAclData(projectProductDevelopment)
    const keys = Object.keys(convertedData)
    keys.forEach((key) => {
      // eslint-disable-next-line security/detect-object-injection
      existingProjectProduct.dataValues[key] = convertedData[key]
    })

    try {
      await this.SqlHelper.upsertBatch(this.collectionModel, [existingProjectProduct.dataValues])
      this.logger.info(`Updated entity with id ${projectProductDevelopment.id} in the database`, generateLogInfos(this.pluginInfos))
    } catch (err) {
      this.logger.error(
        `Failed to UPDATE the SQL entity with id: ${projectProductDevelopment.id} for the following reason: ${err.message}`,
        generateLogInfos(this.pluginInfos, { projectProductDevelopment: existingProjectProduct }, err))
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.updateProjectProductDevelopment()`, generateLogInfos(this.pluginInfos))
    }
  }

  /**
   * Delete the ProjectProductDevelopment for the given id in the database.
   *
   * @param {number} id Identifier of the ProjectProductDevelopment to delete.
   */
  deleteProjectProductDevelopment = async (id) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.deleteProjectProductDevelopment(id=${id})`, generateLogInfos(this.pluginInfos))

    const existingProjectProduct = await this.collectionModel.findByPk(id)

    if (!existingProjectProduct) {
      this.logger.error(`Unable to find an existing ProjectProductDevelopment to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
      return
    }

    try {
      await existingProjectProduct.destroy()
      this.logger.info(`Deleted entity with id ${id} from the database`, generateLogInfos(this.pluginInfos))
    } catch (err) {
      this.logger.error(
        `Failed to DELETE the SQL entity with id: ${id} for the following reason: ${err.message}`,
        generateLogInfos(this.pluginInfos, { projectProductDevelopment: existingProjectProduct }, err))
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.deleteProjectProductDevelopment()`, generateLogInfos(this.pluginInfos))
    }
  }
}
