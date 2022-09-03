import util from 'util'

import {
  generateLogInfos,
  constants,
  mappers,
  sqlModels,
  SqlHelper
} from '@metric/acl-common-modules'

const { domains } = constants
const {
  StyleModel,
  MerchProductVersionSecondariesModel,
  MerchSecondaryVersionModel
} = sqlModels

export default class Business {
  constructor (coreServices, pluginInfos, config) {
    this.pluginInfos = pluginInfos
    this.config = config

    this.logInfos = {
      feature: 'api_to_sql-product-development-',
      stream: config.STREAM,
      labels: {
        plugin: config.PLUGIN_NAME
      }
    }

    this.sql = coreServices.SQL
    this.logger = coreServices.Logger
    this.SqlHelper = new SqlHelper(config, this.logger, this.logInfos)

    this.MerchSecondaryVersionMapper = new mappers.MerchSecondaryVersionMapper()
    this.StyleMapper = new mappers.StyleMapper()
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

    this.MerchSecondaryVersionModel = MerchSecondaryVersionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.MerchProductVersionSecondariesModel = MerchProductVersionSecondariesModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.StyleModel = StyleModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    await this.sql.synchronizeAllModels(this.pluginInfos)

    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.initDatabase()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Process the message concerning BusinessForecastConditions received from Kafka.
   *
   * @param {object} businessConditions The new attributes to update.
   * @param {number} businessConditions.id Identifier of the entity to update.
   * @param {number} businessConditions.operation Type of operation (INSERT, UPDATE, DELETE).
   * @param {object[]} businessConditions.attributes Array containing the modifier attributes.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  processBusinessConditions = async (businessConditions, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.processProductDevelopment(productDevelopment=${businessConditions}, messageKey=${messageKey})`, generateLogInfos(this.pluginInfos))
    if (!businessConditions) {
      throw new Error('BusinessConditions message is null')
    }

    if (typeof (businessConditions) === 'string') {
      businessConditions = JSON.parse(businessConditions)
    }
    const logLabels = generateLogInfos(this.pluginInfos)
    switch (businessConditions.operation) {
      case constants.rabbitMqOperations.insert:
        await this.insertBusinessConditions(businessConditions, messageKey)
        break
      case constants.rabbitMqOperations.update:
        await this.updateBusinessConditions(businessConditions, messageKey)
        break
      case constants.rabbitMqOperations.delete:
        await this.deleteBusinessConditions(businessConditions.id, messageKey)
        break
      default:
        logLabels.labels.kafkaMessage = JSON.stringify(businessConditions)
        this.logger.warn(`Received a message with an unexpected operation: ${businessConditions.operation}`, logLabels)
        break
    }
  }

  /**
   * Get the SQL model and the mapper specific to the recevied domain.
   *
   * @param {string} domain Domain from the received message.
   * @returns {object} The SQL model and the mapper.
   */
  getModelAndMapperForDomain = (domain) => {
    switch (domain) {
      case domains.merchSecondaryVersion:
        return { model: this.MerchSecondaryVersionModel, mapper: this.MerchSecondaryVersionMapper }
      case domains.style:
        return { model: this.StyleModel, mapper: this.StyleMapper }
    }
  }

  /**
   * Insert a new item in the selected database.
   *
   * @param {object} businessConditions The new attributes to update.
   * @param {number} businessConditions.id Identifier of the entity to update.
   * @param {object[]} businessConditions.attributes Array containing the modified attributes.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  insertBusinessConditions = async (businessConditions, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.insertBusinessConditions(businessConditions, messageKey)})`, generateLogInfos(this.pluginInfos))

    if (messageKey === domains.merchProductVersion) {
      try {
        const merchRef = businessConditions.attributes.Secondaries
        const merchProductVersionSecondaries = merchRef.map((element) => ({ merchProductVersionId: businessConditions.id, merchSecondaryVersionId: element }))
        this.SqlHelper.upsertBatch(this.MerchProductVersionSecondariesModel, merchProductVersionSecondaries)
      } catch (err) {
        this.logger.error(
          `Failed to INSERT the SQL entity in the table ${this.MerchProductVersionSecondariesModel.getTableName()} for the following reason: ${err.message}`,
          generateLogInfos(this.pluginInfos, err))
      }
    } else {
      const { model, mapper } = this.getModelAndMapperForDomain(messageKey)
      const entity = mapper.convertMessageToAclData(businessConditions)
      try {
        await this.SqlHelper.upsertBatch(model, [entity])
        this.logger.info(`Inserted new entity with id ${entity.id} in the table ${model.getTableName()}`, generateLogInfos(this.pluginInfos))
      } catch (err) {
        this.logger.error(
          `Failed to INSERT the SQL entity in the table ${model.getTableName()} for the following reason: ${err.message}`,
          generateLogInfos(this.pluginInfos, { entity }, err))
      } finally {
        this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.insertEntity()`, generateLogInfos(this.pluginInfos))
      }
    }
  }

  /**
   * Update an existing item in the selected database.
   *
   * @param {object} businessConditions The new attributes to update.
   * @param {number} businessConditions.id Identifier of the entity to update.
   * @param {object[]} businessConditions.attributes Array containing the modifier attributes.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  updateBusinessConditions = async (businessConditions, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.updateBusinessForecastConditions(businessForecastConditions=${util.inspect(businessConditions)})`, generateLogInfos(this.pluginInfos))

    if (messageKey === domains.merchProductVersion) {
      try {
        const merchRef = businessConditions.attributes.Secondaries
        const merchProductVersionSecondaries = merchRef.map((element) => ({ merchProductVersionId: businessConditions.id, merchSecondaryVersionId: element }))
        this.SqlHelper.upsertBatch(this.MerchProductVersionSecondariesModel, merchProductVersionSecondaries)
      } catch (err) {
        this.logger.error(
          `Failed to INSERT the SQL entity in the table ${MerchProductVersionSecondariesModel.getTableName()} for the following reason: ${err.message}`,
          generateLogInfos(this.pluginInfos, err))
      }
    } else {
      const { model, mapper } = this.getModelAndMapperForDomain(messageKey)

      const existingEntity = await model.findByPk(businessConditions.id)

      if (!existingEntity) {
        this.logger.error(`Unable to find an existing ${model.getTableName()} to UPDATE with id: ${businessConditions.id}`, generateLogInfos(this.pluginInfos))
        return
      }

      const convertedData = mapper.convertMessageToAclData(businessConditions)
      const keys = Object.keys(convertedData)
      keys.forEach((key) => {
        // eslint-disable-next-line security/detect-object-injection
        existingEntity.dataValues[key] = convertedData[key]
      })

      try {
        await this.SqlHelper.upsertBatch(model, [existingEntity.dataValues])
        this.logger.info(`Updated entity with id ${businessConditions.id} in the database`, generateLogInfos(this.pluginInfos))
      } catch (err) {
        this.logger.error(
          `Failed to UPDATE the SQL entity with id ${businessConditions.id} from the table ${model.getTableName()} for the following reason: ${err.message}`,
          generateLogInfos(this.pluginInfos, existingEntity, err))
      } finally {
        this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.updateEntity()`, generateLogInfos(this.pluginInfos))
      }
    }
  }

  /**
   * Delete an item in the selected database.
   *
   * @param {number} id Identifier of the BusinessForecastConditions to delete.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  deleteBusinessConditions = async (id, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.deleteEntity(domain=${messageKey}, id=${id})`, generateLogInfos(this.pluginInfos))

    switch (messageKey) {
      // delete all the merchProductVersionId selected in the table MerchProductVersionSecondaries
      case domains.merchProductVersion:
        try {
          const where = { merchProductVersionId: id }
          const existingMerchProductSecondaries = await this.MerchProductVersionSecondariesModel.findAll({ where })
          if (existingMerchProductSecondaries.length === 0) {
            this.logger.error(`Unable to find an existing MerchProductVersionSecondaries to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
            return
          }
          await this.MerchProductVersionSecondariesModel.destroy({ where })
          this.logger.info(`Deleted entity with id ${id} from the database`, generateLogInfos(this.pluginInfos))
        } catch (err) {
          this.logger.error(
            `Failed to DELETE the SQL entity with id: ${id} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        return

      // delete the StyleBrand selected link to the productSymbol
      case domains.merchSecondaryVersion:
        try {
          const where = { merchSecondaryVersionId: id }
          const existingMerchProductSecondaries = await this.MerchProductVersionSecondariesModel.findAll({ where })
          if (existingMerchProductSecondaries.length === 0) {
            this.logger.error(`Unable to find an existing MerchProductVersionSecondaries to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
            break
          }
          await this.MerchProductVersionSecondariesModel.destroy({ where })
          this.logger.info(`Deleted entity with id ${id} from the database`, generateLogInfos(this.pluginInfos))
        } catch (err) {
          this.logger.error(
            `Failed to DELETE the SQL entity with id: ${id} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
    }

    const { model } = this.getModelAndMapperForDomain(messageKey)

    const existingEntity = await model.findByPk(id)

    if (!existingEntity) {
      this.logger.error(`Unable to find an existing ${model.getTableName()} to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
      return
    }

    try {
      await existingEntity.destroy()
      this.logger.info(`Deleted entity with id ${id} from the table ${model.getTableName()}`, generateLogInfos(this.pluginInfos))
    } catch (err) {
      this.logger.error(
        `Failed to DELETE the SQL entity with id ${id} from the table ${model.getTableName()} for the following reason: ${err.message}`,
        generateLogInfos(this.pluginInfos, { existingEntity }, err))
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.deleteEntity()`, generateLogInfos(this.pluginInfos))
    }
  }
}
