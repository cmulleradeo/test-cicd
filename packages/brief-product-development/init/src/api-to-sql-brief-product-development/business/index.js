import { sqlModels, SqlHelper, mappers } from '@metric/acl-common-modules'
import { MetricApiHelper, MetricApiEndpoints } from '@metric/acl-init-modules'

const {
  MerchCollectionVersionModel,
  MerchSecondaryVersionModel,
  MerchSecondaryPlanModel,
  UserModel,
  MerchCollectionVersionSecondariesModel,
  MerchProductVersionSecondariesModel,
  dropSqlConstraintsAndIndexes
} = sqlModels
const {
  MerchCollectionVersionMapper,
  MerchSecondaryVersionMapper,
  MerchSecondaryPlanMapper,
  UserMapper
} = mappers

export default class BriefProductDevelopmentBusiness {
  constructor (logger, logInfos, config, sql, errorHandler) {
    this.logInfos = logInfos
    this.config = config
    this.logger = logger
    this.sql = sql
    this.errorHandler = errorHandler

    this.api = new MetricApiHelper(logger, logInfos, config)
    this.SqlHelper = new SqlHelper(config, logger, logInfos)
  }

  init = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.init()`, this.logInfos)
    const postgreOptions = {
      dialectOptions: {
        ssl: {
          require: this.config.SQL_USE_SSL,
          rejectUnauthorized: false
        },
        keepAlive: true
      }
    }
    await this.sql.connectToDatabase(this.logInfos, postgreOptions)

    await dropSqlConstraintsAndIndexes(this.sql.getSequelizeInstance(this.logInfos))

    this.merchCollectionVersionModel = MerchCollectionVersionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.logInfos),
      this.sql.DataTypes
    )
    this.merchSecondaryVersionModel = MerchSecondaryVersionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.logInfos),
      this.sql.DataTypes
    )
    this.merchSecondaryPlanModel = MerchSecondaryPlanModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.logInfos),
      this.sql.DataTypes
    )
    this.userModel = UserModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.logInfos),
      this.sql.DataTypes
    )
    this.merchCollectionVersionSecondariesModel = MerchCollectionVersionSecondariesModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.logInfos),
      this.sql.DataTypes
    )
    this.merchProductVersionSecondariesModel = MerchProductVersionSecondariesModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.logInfos),
      this.sql.DataTypes
    )

    await this.sql.synchronizeAllModels(this.logInfos, true)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.init()`, this.logInfos)
  }

  /**
   * Get the Merch Collection Versions from the Metric API and insert them in the database.
   */
  getMerchCollectionVersions = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getMerchCollectionVersions()`, this.logInfos)
    const { merchCollectionVersions } = await this.api.getAllMerchCollectionVersions()

    const mapper = new MerchCollectionVersionMapper()
    const mappedMerchCollectionVersions = merchCollectionVersions.map(mapper.convertToAclData)

    try {
      await this.SqlHelper.upsertBatch(this.merchCollectionVersionModel, mappedMerchCollectionVersions)
    } catch (err) {
      throw new Error(`Failed to insert the Merch Collection Version: ${err.message}`)
    }

    const secondaries = []
    merchCollectionVersions.forEach((secondary) => {
      if (secondary.secondaries.length && secondary.secondaries.length > 0) {
        secondary.secondaries.forEach((item) => {
          secondaries.push({
            merchCollectionVersionId: secondary.$id,
            merchSecondaryVersionId: item
          })
        })
      }
    })
    try {
      await this.SqlHelper.upsertBatch(this.merchCollectionVersionSecondariesModel, secondaries)
    } catch (err) {
      throw new Error(`Failed to insert the Merch Collection Versions: ${err.message}`)
    }

    this.logger.info('Successfully initialized the Merch Collection Version.', this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getMerchCollectionVersions()`, this.logInfos)
  }

  /**
   * Get the Merch Secondary Versions from the Metric API and insert them in the database.
   */
  getMerchSecondaryVersions = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getMerchSecondaryVersions()`, this.logInfos)

    const limit = 5000
    let skip = 0
    let apiResponse
    const mapper = new MerchSecondaryVersionMapper()

    do {
      apiResponse = await this.api.getData(MetricApiEndpoints.merch_secondary_versions, skip, limit)
      try {
        await this.SqlHelper.upsertBatch(this.merchSecondaryVersionModel, apiResponse.data.map(mapper.convertApiToAclData))
      } catch (err) {
        throw new Error(`Failed to insert the Merch Secondary Version: ${err.message}`)
      }

      skip += limit
    } while (!apiResponse.allDataReturned)

    this.logger.info('Successfully initialized the Merch Secondary Version.', this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getMerchSecondaryVersions()`, this.logInfos)
  }

  /**
   * Get the Merch Secondary Plans from the Metric API and insert them in the database.
   */
  getMerchSecondaryPlans = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getMerchSecondaryPlans()`, this.logInfos)
    const { merchSecondaryPlans } = await this.api.getAllMerchSecondaryPlans()

    const mapper = new MerchSecondaryPlanMapper()
    const mappedMerchSecondaryPlans = merchSecondaryPlans.map(mapper.convertToAclData)

    try {
      await this.SqlHelper.upsertBatch(this.merchSecondaryPlanModel, mappedMerchSecondaryPlans)
    } catch (err) {
      throw new Error(`Failed to insert the Merch Secondary Plans: ${err.message}`)
    }

    this.logger.info('Successfully initialized the Merch Secondary Plans.', this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getMerchSecondaryPlans()`, this.logInfos)
  }

  /**
   * Get the Users from the Metric API and insert them in the database.
   */
  getUsers = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getUsers()`, this.logInfos)
    const { users } = await this.api.getAllUsers()

    const mapper = new UserMapper()
    const mappedUsers = users.map(mapper.convertToAclData)

    try {
      await this.SqlHelper.upsertBatch(this.userModel, mappedUsers)
    } catch (err) {
      throw new Error(`Failed to insert the User: ${err.message}`)
    }

    this.logger.info('Successfully initialized the User.', this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getUsers()`, this.logInfos)
  }

  /**
   * Get the merch Product Version secondaries from the Metric API and insert them in the database.
   */
  getMerchProductVersions = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getMerchProductVersion()`, this.logInfos)
    const { merchProductVersions } = await this.api.getAllMerchProductVersions()

    const secondaries = []
    merchProductVersions.forEach((merchProductVersion) => {
      if (merchProductVersion.secondaries.length && merchProductVersion.secondaries.length > 0) {
        // HSE sends duplicates in secondaries, use Set to remove duplicates
        [...new Set(merchProductVersion.secondaries)].forEach((secondary) => {
          secondaries.push({
            merchProductVersionId: merchProductVersion.$id,
            merchSecondaryVersionId: secondary
          })
        })
      }
    })
    try {
      await this.SqlHelper.upsertBatch(this.merchProductVersionSecondariesModel, secondaries, null)
    } catch (err) {
      throw new this.errorHandler.PgValidationError({
        message: `Failed to insert the Merch Product Version secondaries: ${err.message}`,
        ...this.logInfos,
        validationErrors: err.errors ?? []
      })
    }

    this.logger.info('Successfully initialized the Merch Product Version secondaries.', this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getMerchProductVersion()`, this.logInfos)
  }

  /**
   * Get all the data required for the Brief Product Development business term.
   */
  getBriefProductDevelopmentBusinessTerm = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getBriefProductDevelopmentBusinessTerm()`, this.logInfos)

    await Promise.all([
      this.getMerchCollectionVersions(),
      this.getMerchSecondaryPlans(),
      this.getMerchSecondaryVersions(),
      this.getUsers(),
      this.getMerchProductVersions()
    ])

    this.logger.info('Business term initialized.', this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getBriefProductDevelopmentBusinessTerm()`, this.logInfos)
  }
}
