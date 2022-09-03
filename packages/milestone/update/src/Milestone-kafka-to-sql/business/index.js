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
  ActivityModel,
  RoleModel,
  CalendarActivitiesModel
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

    this.ActivityMapper = new mappers.ActivityMapper()
    this.RoleMapper = new mappers.RoleMapper()
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

    this.ActivityModel = ActivityModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.RoleModel = RoleModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.CalendarActivitiesModel = CalendarActivitiesModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    await this.sql.synchronizeAllModels(this.pluginInfos)

    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.initDatabase()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Process the message concerning Milestone received from Kafka.
   *
   * @param {object} milestone The new attributes to update.
   * @param {number} milestone.id Identifier of the entity to update.
   * @param {number} milestone.operation Type of operation (INSERT, UPDATE, DELETE).
   * @param {object[]} milestone.attributes Array containing the modifier attributes.
   * @param {string} messageKey Key of the message (Activity, Role, ..)
   */
  processMilestone = async (milestone, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.processMilestone(milestone=${milestone})`, generateLogInfos(this.pluginInfos))
    if (!milestone) {
      throw new Error('Milestone message is null')
    }
    if (typeof (milestone) === 'string') {
      milestone = JSON.parse(milestone)
    }
    const logLabels = generateLogInfos(this.pluginInfos)
    switch (milestone.operation) {
      case constants.rabbitMqOperations.insert:
        await this.insertMilestone(milestone, messageKey)
        break
      case constants.rabbitMqOperations.update:
        await this.updateMilestone(milestone, messageKey)
        break
      case constants.rabbitMqOperations.delete:
        await this.deleteMilestone(milestone.id, messageKey)
        break
      default:
        logLabels.labels.message = JSON.stringify(milestone)
        this.logger.warn(`Received a message with an unexpected operation: ${milestone.operation}`, logLabels)
        break
    }
    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.processMilestone()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Get the SQL model and the mapper specific to the recevied domain.
   *
   * @param {string} domain Domain from the received message.
   * @returns {object} The SQL model and the mapper.
   */
  getModelAndMapperForDomain = (domain) => {
    switch (domain) {
      case domains.activity:
        return { model: this.ActivityModel, mapper: this.ActivityMapper }
      case domains.role:
        return { model: this.RoleModel, mapper: this.RoleMapper }
    }
  }

  /**
   * Insert a new item in the selected database.
   *
   * @param {object} milestone The new attributes to update.
   * @param {number} milestone.id Identifier of the entity to update.
   * @param {object[]} milestone.attributes Array containing the modified attributes.
   * @param {string} messageKey Key of the message (Activity, Role, ..)
   */
  insertMilestone = async (milestone, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.insertMilestone(businessForecastConditions)})`, generateLogInfos(this.pluginInfos))

    const { model, mapper } = this.getModelAndMapperForDomain(messageKey)
    const entity = mapper.convertMessageToAclData(milestone)

    if (messageKey === domains.calendar) {
      try {
        const activityref = milestone.attributes.activities
        const CalendarActivities = activityref.map((element) => ({ calendarId: milestone.id, activityId: element }))
        this.SqlHelper.upsertBatch(this.CalendarActivitiesModel, CalendarActivities)
      } catch (err) {
        this.logger.error(
          `Failed to INSERT the SQL entity in the table ${this.MerchProductVersionSecondariesModel.getTableName()} for the following reason: ${err.message}`,
          generateLogInfos(this.pluginInfos, err))
      }
    } else {
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
   * @param {object} milestone The new attributes to update.
   * @param {number} milestone.id Identifier of the entity to update.
   * @param {object[]} milestone.attributes Array containing the modifier attributes.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  updateMilestone = async (milestone, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.updateMilestone(milestone=${util.inspect(milestone)})`, generateLogInfos(this.pluginInfos))

    if (messageKey === domains.calendar) {
      try {
        const activityRef = milestone.attributes.activities
        const calendarActivities = activityRef.map((element) => ({ calendarId: milestone.id, activityId: element }))
        this.SqlHelper.upsertBatch(this.CalendarActivitiesModel, calendarActivities)
      } catch (err) {
        this.logger.error(
          `Failed to INSERT the SQL entity in the table ${CalendarActivitiesModel.getTableName()} for the following reason: ${err.message}`,
          generateLogInfos(this.pluginInfos, err))
      }
    } else {
      const { model, mapper } = this.getModelAndMapperForDomain(messageKey)

      const existingEntity = await model.findByPk(milestone.id)

      if (!existingEntity) {
        this.logger.error(`Unable to find an existing ${model.getTableName()} to UPDATE with id: ${milestone.id}`, generateLogInfos(this.pluginInfos))
        return
      }

      const convertedData = mapper.convertMessageToAclData(milestone)
      const keys = Object.keys(convertedData)
      keys.forEach((key) => {
        // eslint-disable-next-line security/detect-object-injection
        existingEntity.dataValues[key] = convertedData[key]
      })

      try {
        await this.SqlHelper.upsertBatch(model, [existingEntity.dataValues])
        this.logger.info(`Updated entity with id ${milestone.id} in the database`, generateLogInfos(this.pluginInfos))
      } catch (err) {
        this.logger.error(
          `Failed to UPDATE the SQL entity with id ${milestone.id} from the table ${model.getTableName()} for the following reason: ${err.message}`,
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
  deleteMilestone = async (id, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.deleteMilestone(domain=${messageKey}, id=${id})`, generateLogInfos(this.pluginInfos))

    switch (messageKey) {
      // delete all the calendarId selected in the table CalendarActivities
      case domains.calendar:
        try {
          const where = { calendarId: id }
          const existingCalendarActivities = await this.CalendarActivitiesModel.findAll({ where })
          if (existingCalendarActivities.length === 0) {
            this.logger.error(`Unable to find an existing CalendarActivities to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
            return
          }
          await this.CalendarActivitiesModel.destroy({ where })
          this.logger.info(`Deleted entity with id ${id} from the database`, generateLogInfos(this.pluginInfos))
        } catch (err) {
          this.logger.error(
            `Failed to DELETE the SQL entity with id: ${id} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        return

      // delete the CalendarActivities selected link to the activity
      case domains.activity:
        try {
          const where = { activityId: id }
          const existingCalendarActivities = await this.CalendarActivitiesModel.findAll({ where })
          if (existingCalendarActivities.length === 0) {
            this.logger.error(`Unable to find an existing MerchProductVersionSecondaries to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
            break
          }
          await this.CalendarActivitiesModel.destroy({ where })
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
