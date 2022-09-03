import jsonSampleConfig from './sample_config.json'
import ProjectProductDevelopmentBusiness from './business'

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
    this.business = new ProjectProductDevelopmentBusiness(coreServices, this.logInfos, config)
    this.config = config
    this.logger = coreServices.Logger
    this.errorHandler = coreServices.ErrorHandler
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
      this.errorHandler.errorHandler(err)
      throw err
    }

    try {
      await this.business.getProjectProductDevelopmentBusinessTerm()
    } catch (err) {
      this.errorHandler.errorHandler(err)
      throw err
    }

    this.logger.debug(`<<<<< Exiting ${this.config.PLUGIN_NAME}.start()`, this.logInfos)
  }
}

export default ApiToSql
