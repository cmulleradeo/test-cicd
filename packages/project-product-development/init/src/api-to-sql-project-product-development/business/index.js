import { sqlModels, SqlHelper, mappers } from '@metric/acl-common-modules'
import { MetricApiHelper } from '@metric/acl-init-modules'

const {
  CollectionModel,
  CollectionSpecSectionModel,
  dropSqlConstraintsAndIndexes
} = sqlModels
const { CollectionMapper } = mappers

export default class projectProductDevelopmentBusiness {
  constructor (coreServices, logInfos, config) {
    this.logInfos = logInfos
    this.config = config
    this.logger = coreServices.Logger
    this.sql = coreServices.SQL

    this.api = new MetricApiHelper(coreServices.Logger, logInfos, config, coreServices.ErrorHandler)
    this.SqlHelper = new SqlHelper(config, coreServices.Logger, logInfos)
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

    await dropSqlConstraintsAndIndexes(this.sql.getSequelizeInstance(this.logInfos))

    this.collectionModel = CollectionModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.collectionSpecSectionModel = CollectionSpecSectionModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    await this.sql.synchronizeAllModels(this.logInfos, true)

    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.init()`, this.logInfos)
  }

  getProjectProductDevelopmentBusinessTerm = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.getProjectProductDevelopmentBusinessTerm()`, this.logInfos)

    const [
      { collections },
      { category1 },
      { category2 },
      { season }
    ] = await Promise.all([
      this.api.getAllCollections(),
      this.api.getAllCategory1(),
      this.api.getAllCategory2(),
      this.api.getAllSeasons()
    ])

    const mapper = new CollectionMapper(category1, category2, season)
    // filter out group project,  Postponed(ADEO_ProjectStatus:3) and Cancelled(ADEO_ProjectStatus:2)
    const filteredCollections = collections
      .filter((collec) => !collec.adeo_collection_project_group_boolean &&
        collec.adeo_collection_project_status_enum !== 'ADEO_ProjectStatus:3' &&
        collec.adeo_collection_project_status_enum !== 'ADEO_ProjectStatus:2')
    const projectProductDevelopments = filteredCollections.map(mapper.convertToAclData)

    const transaction = await this.sql.createTransaction(this.logInfos)
    try {
      await this.SqlHelper.upsertBatch(this.collectionModel, projectProductDevelopments, transaction)
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw new Error(`Failed to insert the Project Product Development business terms: ${err.message}`)
    }

    const models = []
    filteredCollections.forEach((model) => {
      if (model.adeo_list_of_models.length && model.adeo_list_of_models.length > 0) {
        model.adeo_list_of_models.forEach((item) => {
          models.push({
            collectionId: model.$id,
            specSectionId: item
          })
        })
      }
    })
    try {
      await this.SqlHelper.upsertBatch(this.collectionSpecSectionModel, models)
    } catch (err) {
      throw new Error(`Failed to insert the Collection spec section model: ${err.message}`)
    }

    this.logger.info('Successfully initialized the Collection.', this.logInfos)
    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.getProjectProductDevelopmentBusinessTerm()`, this.logInfos)
  }
}
