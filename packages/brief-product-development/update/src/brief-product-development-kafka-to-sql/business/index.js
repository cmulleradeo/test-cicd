import util from 'util'
import {
  generateLogInfos,
  sqlModels,
  constants,
  mappers,
  SqlHelper
} from '@metric/acl-common-modules'

const { domains } = constants
const {
  MerchCollectionVersionModel,
  MerchSecondaryVersionModel,
  MerchSecondaryPlanModel,
  SpecSectionModel,
  UserModel
} = sqlModels
const {
  MerchCollectionVersionMapper,
  MerchSecondaryVersionMapper,
  MerchSecondaryPlanMapper,
  SpecSectionMapper,
  UserMapper
} = mappers

export default class Business {
  constructor (coreServices, pluginInfos, config) {
    this.pluginInfos = pluginInfos
    this.config = config

    this.sql = coreServices.SQL
    this.logger = coreServices.Logger
    this.SqlHelper = new SqlHelper(config, this.logger, this.logInfos)

    this.merchCollectionVersionMapper = new MerchCollectionVersionMapper()
    this.merchSecondaryVersionMapper = new MerchSecondaryVersionMapper()
    this.merchSecondaryPlanMapper = new MerchSecondaryPlanMapper()
    this.specSectionMapper = new SpecSectionMapper()
    this.userMapper = new UserMapper()
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

    this.merchCollectionVersionModel = MerchCollectionVersionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )
    this.merchSecondaryVersionModel = MerchSecondaryVersionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )
    this.merchSecondaryPlanModel = MerchSecondaryPlanModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )
    this.specSectionModel = SpecSectionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )
    this.userModel = UserModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    await this.sql.synchronizeAllModels(this.pluginInfos)

    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.initDatabase()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Process the message received from Kafka.
   *
   * @param {object} message Message received from Kafka.
   * @param {number} message.id Id of the entity.
   * @param {number} message.operation Type of operation that triggered the message (INSERT, UPDATE, DELETE).
   * @param {object} message.attributes Attributes of the entity.
   * @param {string} key Key of the Kafka message; matching the RabbitMQ domain.
   */
  processMessage = async (message, key) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.processMessage(message=${message})`, generateLogInfos(this.pluginInfos))
    if (!message) {
      throw new Error('ProjectProductDevelopment message is null')
    }

    if (typeof (message) === 'string') {
      message = JSON.parse(message)
    }
    const logLabels = generateLogInfos(this.pluginInfos)
    switch (message.operation) {
      case constants.rabbitMqOperations.insert:
        await this.insertEntity(key, message)
        break
      case constants.rabbitMqOperations.update:
        await this.updateProjectProductDevelopment(key, message)
        break
      case constants.rabbitMqOperations.delete:
        await this.deleteProjectProductDevelopment(key, message.id)
        break
      default:
        logLabels.labels.message = JSON.stringify(message)
        this.logger.warn(`Received a message with an unexpected operation: ${message.operation}`, logLabels)
        break
    }
    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.processMessage()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Get the SQL model and the mapper specific to the recevied domain.
   *
   * @param {string} domain Domain from the received message.
   * @returns {object} The SQL model and the mapper.
   */
  getModelAndMapperForDomain = (domain) => {
    switch (domain) {
      case domains.merchCollectionVersion:
        return { model: this.merchCollectionVersionModel, mapper: this.merchCollectionVersionMapper }
      case domains.merchSecondaryVersion:
        return { model: this.merchSecondaryVersionModel, mapper: this.merchSecondaryVersionMapper }
      case domains.merchSecondaryPlan:
        return { model: this.merchSecondaryPlanModel, mapper: this.merchSecondaryPlanMapper }
      case domains.specSection:
        return { model: this.specSectionModel, mapper: this.specSectionMapper }
      case domains.user:
        return { model: this.userModel, mapper: this.UserMapper }
    }
  }

  /**
   * Insert a new entity in the database
   *
   * @param {string} domain Domain from the received message.
   * @param {*} message Message received from Kafka.
   */
  insertEntity = async (domain, message) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.insertEntity(domain=${domain}, message=${util.inspect(message)}))`, generateLogInfos(this.pluginInfos))

    const { model, mapper } = this.getModelAndMapperForDomain(domain)

    const entity = mapper.convertMessageToAclData(message)
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

  /**
   * Update an existing entity in the database
   *
   * @param {string} domain Domain from the received message.
   * @param {*} message Message received from Kafka.
   */
  updateEntity = async (domain, message) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.updateEntity(domain=${domain}, message=${util.inspect(message)})`, generateLogInfos(this.pluginInfos))

    const { model, mapper } = this.getModelAndMapperForDomain(domain)

    const existingEntity = await model.findByPk(message.id)

    if (!existingEntity) {
      this.logger.error(`Unable to find an existing ${model.getTableName()} to UPDATE with id: ${message.id}`, generateLogInfos(this.pluginInfos))
      return
    }

    const convertedData = mapper.convertMessageToAclData(message)
    const keys = Object.keys(convertedData)
    keys.forEach((key) => {
      // eslint-disable-next-line security/detect-object-injection
      existingEntity.dataValues[key] = convertedData[key]
    })

    try {
      await this.SqlHelper.upsertBatch(model, [existingEntity.dataValues])
      this.logger.info(`Updated entity with id ${message.id} in the database`, generateLogInfos(this.pluginInfos))
    } catch (err) {
      this.logger.error(
        `Failed to UPDATE the SQL entity with id ${message.id} from the table ${model.getTableName()} for the following reason: ${err.message}`,
        generateLogInfos(this.pluginInfos, existingEntity, err))
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.updateEntity()`, generateLogInfos(this.pluginInfos))
    }
  }

  /**
   * Delete an entity from the database.
   *
   * @param {string} domain Domain from the received message.
   * @param {number} id Identifier of the entity to delete.
   */
  deleteEntity = async (domain, id) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.deleteEntity(domain=${domain}, id=${id})`, generateLogInfos(this.pluginInfos))

    const { model } = this.getModelAndMapperForDomain(domain)

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
