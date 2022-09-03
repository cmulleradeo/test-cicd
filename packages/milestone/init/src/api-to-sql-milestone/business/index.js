import { SqlHelper, sqlModels, mappers } from '@metric/acl-common-modules'
import { MetricApiHelper } from '@metric/acl-init-modules'

const {
  CalendarActivitiesModel,
  ActivityModel,
  RoleModel
} = sqlModels

const {
  ActivityMapper,
  RoleMapper
} = mappers

class Business {
  constructor (logger, logInfos, config, { SQL, ErrorHandler }) {
    this.logInfos = logInfos
    this.config = config
    this.logger = logger
    this.sql = SQL
    this.errorHandler = ErrorHandler

    this.api = new MetricApiHelper(logger, logInfos, config, ErrorHandler)
    this.SqlHelper = new SqlHelper(config, logger, logInfos)
  }

  init = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.init()`, this.logInfos)
    const postgreOptions = {}
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this.config.SQL_USE_SSL) {
      postgreOptions.dialectOptions = {
        ssl: {
          require: this.config.SQL_USE_SSL,
          rejectUnauthorized: false
        },
        keepAlive: true
      }
    }
    await this.sql.connectToDatabase(this.logInfos, postgreOptions)

    this.calendarActivitiesModel = CalendarActivitiesModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.activityModel = ActivityModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.roleModel = RoleModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    await this.sql.synchronizeAllModels(this.logInfos, true)

    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.init()`, this.logInfos)
  }

  /**
   * Get the merch Product Version secondaries from the Metric API and insert them in the database.
   */
  getCalendars = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getCalendar()`, this.logInfos)
    const { calendars } = await this.api.getAllCalendars()

    const activities = []
    calendars.forEach((calendar) => {
      if (calendar.activities.length && calendar.activities.length > 0) {
        // HSE sends duplicates in activities, use Set to remove duplicates
        [...new Set(calendar.activities)].forEach((activity) => {
          activities.push({
            calendarId: calendar.$id,
            activityId: activity
          })
        })
      }
    })
    try {
      await this.SqlHelper.upsertBatch(this.calendarActivitiesModel, activities, null)
    } catch (err) {
      throw new this.errorHandler.PgValidationError({
        message: `Failed to insert the Calendar Activities: ${err.message}`,
        ...this.logInfos,
        validationErrors: err.errors ?? []
      })
    }

    this.logger.info('Successfully initialized the Calendar Activities.', this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getCalendar()`, this.logInfos)
  }

  getActivities = async () => {
    const { activities } = await this.api.getAllActivities()
    const activityMapper = new ActivityMapper()
    try {
      await this.SqlHelper.upsertBatch(this.activityModel, activities.map(activityMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Activities ${err.message}`)
    }
  }

  getRoles = async () => {
    const { roles } = await this.api.getAllRoles()
    const roleMapper = new RoleMapper()
    try {
      await this.SqlHelper.upsertBatch(this.roleModel, roles.map(roleMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Roles ${err.message}`)
    }
  }

  getBusinessTerm = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getBusinessTerm()`, this.logInfos)

    await Promise.all([
      this.getActivities(),
      this.getCalendars(),
      this.getRoles()
    ])

    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getBusinessTerm()`, this.logInfos)
  }
}

export default Business
