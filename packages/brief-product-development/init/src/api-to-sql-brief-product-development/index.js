import jsonSampleConfig from './sample_config.json'
import BriefProductDevelopmentBusiness from './business'

let prefixEnv = 'API_TO_SQL'

class ApiToSql {
  constructor (coreServices, config) {
    // init log config
    this.logInfos = {
      feature: 'api_to_sql-project-product-development-',
      stream: config.STREAM,
      labels: {
        plugin: config.PLUGIN_NAME
      }
    }

    this.sql = coreServices.SQL
    this.business = new BriefProductDevelopmentBusiness(coreServices.Logger, this.logInfos, config, this.sql, coreServices.ErrorHandler)
    this.config = config
    this.logger = coreServices.Logger
    this.ErrorHandler = coreServices.ErrorHandler
  }

  // Retrieve the sample config from JSON file
  static getJsonSampleConfig () { return jsonSampleConfig }

  getPrefixEnv () { return prefixEnv }
  setPrefixEnv (prefix) { prefixEnv = prefix }

  start = async () => {
    this.logger.debug(`>>>> Entering ${this.config.PLUGIN_NAME}.start()`, this.logInfos)

    try {
      await this.business.init()
    } catch (err) {
      this.logger.error(`Failed to init the Business service: ${err}`)
      throw err
    }

    try {
      await this.business.getBriefProductDevelopmentBusinessTerm()
    } catch (err) {
      this.ErrorHandler.errorHandler(err)
      this.logger.error(`An error occured while retrieving the business term: ${err}`)
      throw err
    }

    this.logger.debug(`<<<<< Exiting ${this.config.PLUGIN_NAME}.start()`, this.logInfos)
  }
}

export default ApiToSql
