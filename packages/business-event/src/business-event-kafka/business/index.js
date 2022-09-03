import {
  generateLogInfos,
  SqlHelper,
  sqlModels
} from '@metric/acl-common-modules'
const { CollectionModel, CalendarActivitiesModel } = sqlModels

export default class Business {
  constructor (coreServices, pluginInfos, config) {
    this.pluginInfos = pluginInfos
    this.config = config

    this.logInfos = {
      feature: 'business-event-kafka',
      stream: config.STREAM,
      labels: {
        plugin: config.PLUGIN_NAME
      }
    }

    this.sql = coreServices.SQL
    this.logger = coreServices.Logger
    this.SqlHelper = new SqlHelper(config, this.logger, this.logInfos)
    this.kafkaProducer = coreServices.KafkaProducer
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

    this.calendarActivitiesModel = CalendarActivitiesModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    await this.sql.synchronizeAllModels(this.pluginInfos)

    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.initDatabase()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Process the message concerning Activity received from Kafka.
   *
   * @param {object} message The new attributes to update.
   * @param {number} message.id Identifier of the entity.
   */
  processEvent = async (message) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.processEvent(message=${message})`, generateLogInfos(this.pluginInfos))
    if (!message) {
      throw new Error('Event message is null')
    }

    if (message?.attributes?.ADEO_CalendarActivityBase_Milestone_Enum === 'ADEO_Milestones:GO FOR MASS PRODUCTION') {
      const calendar = await this.calendarActivitiesModel.findOne({ where: { activityId: message.id } })
      if (!calendar) {
        this.logger.error(`Unable to find an existing CalendarActivities linked to this Activity id: ${message.id}`, generateLogInfos(this.pluginInfos))
        return
      }
      const collection = await this.collectionModel.findOne({ where: { calendar: calendar.dataValues.calendarId } })
      if (!collection) {
        this.logger.error(`Unable to find an existing Collection linked to this Activity id: ${message.id}`, generateLogInfos(this.pluginInfos))
        return
      }
      const businessEvent = { projectCode: collection.dataValues.projectCode }
      const kafkaMessage = {
        topic: this.config.PRODUCER_TOPIC,
        messages: [
          businessEvent
        ]
      }
      await this.kafkaProducer.createProducer(this.pluginInfos)
      await this.kafkaProducer.sendMessage(kafkaMessage, this.pluginInfos)
    } else {
      this.logger.debug('Milestone not going for MASS PROD')
    }

    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.processEvent()`, generateLogInfos(this.pluginInfos))
  }
}
