import { generateLogInfos } from '@metric/acl-common-modules'

import jsonSampleConfig from './sample_config.json'
import Business from './business'

let prefixEnv = 'API_TO_SQL'

class ApiToSql {
  constructor (coreServices, config) {
    this.logInfos = {
      feature: 'api_to_sql-product-development-',
      stream: config.STREAM,
      labels: {
        plugin: config.PLUGIN_NAME
      }
    }

    this.config = config
    this.logger = coreServices.Logger

    this.API_LIMIT = parseInt(this.config.API_LIMIT, 10)

    this.business = new Business(coreServices.Logger, this.logInfos, config, coreServices)
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
      this.logger.error(`Failed to init the business: ${err}`, generateLogInfos(this.pluginInfos, null, err))
      throw err
    }

    try {
      await this.business.getBusinessTerm()
    } catch (err) {
      this.logger.error(`${err}`, generateLogInfos(this.pluginInfos, null, err))
      throw err
    }

    this.logger.debug(`<<<<< Exiting ${this.config.PLUGIN_NAME}.start()`, this.logInfos)
  }
}

export default ApiToSql
