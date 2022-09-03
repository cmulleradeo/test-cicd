import ServicesCores from './services'

import coreSampleConfig from '../sample_config.json'
import api from './core-api/index'

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  ServicesCores.ErrorHandler.errorHandler(err)
})
process.on('unhandledRejection', (err) => {
  ServicesCores.ErrorHandler.errorHandler(err)
})

class MetricAclCore {
  /**
   * Main constructor of the MEtric ACL core.
   *
   * @param {Array.<{plugin: *, prefix: string}>} plugins - Array of objects containing 2 properties: the plugin and its prefix.
   */
  constructor (plugins) {
    ServicesCores.Logger.info('Application initialization', { labels: { service: 'Startup' } })
    this.plugins = plugins
    this.configCheckErrors = []
    this.instances = []
    this.checkEnvPrefixesUniqueness()
    this.checkGlobalConfig()
    api.start()
  }

  /**
   * Check the uniqueness of environment prefixes between the different plugins.
   */
  checkEnvPrefixesUniqueness () {
    const prefixes = new Set(this.plugins.map((plugin) => plugin.prefix))
    if (Array.from(prefixes).length !== this.plugins.length) {
      ServicesCores.Logger.error('Several plugins have the same environment prefix', { labels: { service: 'Startup' } })
      process.exit(1)
    }
  }

  /*
  * Check if the core environment variables are correctly filled in, based on its JSON sample config file.
  */
  checkGlobalConfig () {
    this.processConfig(
      coreSampleConfig,
      coreSampleConfig.reduce((acc, cur) => {
        return Object.assign(acc, { [cur.name]: process.env[cur.name] })
      }, {}),
      '')
  }

  /**
   * Retrieve plugin configuration.
   *
   * @param {*} plugin - Plugin to operate on (imported class).
   * @param {string} prefix - Desired plugin prefix.
   * @returns {object} Object containing the relevant environment variables.
   */
  getConfig (plugin, prefix) {
    const sampleConfig = plugin.getJsonSampleConfig()
    const config = Object.keys(process.env).reduce((acc, envKey) => {
      if (envKey.includes(prefix)) {
        acc[envKey.substring(prefix.length + 1)] = process.env[String(envKey)]
      }
      return acc
    }, {})
    this.processConfig(sampleConfig, config, prefix)
    return config
  }

  /**
   * Called by processConfig, process a plugin config if the variable is a boolean
   *
   * @param {object} variable config in sampleCongig.
   * @param {object} config Plugin config to be processed.
   * @param {string} env Plugin environment prefix.
   */
  processConfigBool (variable, config, env) {
    if (config[variable.name] === 'false') {
      config[variable.name] = false
    } else {
      config[variable.name] = Boolean(config[variable.name])
    }
  }

  /**
   * Called by processConfig, process a plugin config if the variable is a number
   *
   * @param {object} variable config in sampleCongig.
   * @param {object} config Plugin config to be processed.
   * @param {string} env Plugin environment prefix.
   */
  processConfigNumber (variable, config, env) {
    if (isNaN(config[variable.name])) {
      if (variable.default) {
        config[variable.name] = variable.default
        ServicesCores.Logger.warn(`${env + variable.name} environment variable set as default value ${variable.default}`, { labels: { service: 'Startup' } })
      } else {
        this.configCheckErrors.push(`${env + variable.name} environment variable is declared as being a number but is not set as number`)
      }
    } else {
      config[variable.name] = Number(config[variable.name])
    }
  }

  /**
   * Called by processConfig, process a plugin config if the variable is a string
   *
   * @param {object} variable config in sampleCongig.
   * @param {object} config Plugin config to be processed.
   * @param {string} env Plugin environment prefix.
   */
  processConfigString (variable, config, env) {
    if (variable.required && config[variable.name] === '') {
      ServicesCores.Logger.warn(`${env + variable.name} environment variable is declared as required string but is set as empty string, is it expected?`, { labels: { service: 'Startup' } })
    }
  }

  /**
   * Process a plugin config based on its JSON sample config and list all declaration errors in configCheckErrors.
   *
   * @param {Array} sampleConfig Plugin sample config.
   * @param {object} config Plugin config to be processed.
   * @param {string} env Plugin environment prefix.
   */
  processConfig (sampleConfig, config, env) {
    let envPrefix = ''
    if (env?.length > 0) {
      envPrefix = env + '_'
    }
    sampleConfig.forEach((variable) => {
      const configVariableName = config[variable.name]
      if (typeof configVariableName === 'undefined') {
        if (variable.default) {
          config[variable.name] = variable.default
          ServicesCores.Logger.warn(`${envPrefix + variable.name} environment variable set as default value ${variable.default}`, { labels: { service: 'Startup' } })
        } else if (variable.required) {
          this.configCheckErrors.push(`${envPrefix + variable.name} environment variable is declared as required but was not found`)
        }
        return
      }
      switch (variable.type) {
        case 'string':
          this.processConfigString(variable, config, envPrefix)
          break
        case 'number':
          this.processConfigNumber(variable, config, envPrefix)
          break
        case 'boolean':
          this.processConfigBool(variable, config, envPrefix)
      }
    })
  }

  /**
   * Set the plugin passed as a parameter by retrieving its configuration and creating an instance.
   *
   * @param {object} obj - Plugin to be set.
   * @param {*} obj.plugin - The plugin itself (imported class).
   * @param {string} obj.prefix - The desired plugin prefix.
   */
  setPlugin ({ plugin: Plugin, prefix }) {
    const config = this.getConfig(Plugin, prefix)
    const inst = new Plugin(ServicesCores, config)
    inst.setPrefixEnv(prefix)
    this.instances.push({ Plugin, inst })
  }

  /**
   * Stop the plugin passed as a parameter by launching its stop function.
   *
   * @param {*} inst - Plugin to be stopped.
   * @returns {Promise} Resolved promise if success, rejected otherwise.
   */
  async stopPlugin (inst) {
    if (typeof inst.stop !== 'function') {
      ServicesCores.Logger.warn(`${inst.config.PLUGIN_NAME} will be stopped without its shutdown process`, { labels: { service: 'Shutdown', plugin: inst.config.PLUGIN_NAME } })
      return
    }

    ServicesCores.Logger.info(`${inst.config.PLUGIN_NAME} will be stopped with its shutdown process`, { labels: { service: 'Shutdown', plugin: inst.config.PLUGIN_NAME } })
    await inst.stop()
  }

  /**
   * Call stopPlugin() for each plugin instance passed in the array parameter.
   *
   * @param {Array} pluginInstances - Array of plugin instances.
   */
  async stopPlugins (pluginInstances) {
    ServicesCores.Logger.info('Stopping plugins', { labels: { service: 'Shutdown' } })

    const failedShutdowns = []
    for (const inst of pluginInstances) {
      try {
        await this.stopPlugin(inst)
      } catch {
        failedShutdowns.push(`- Failed to stop the plugin ${inst.getPrefixEnv()}`)
      }
    }

    if (failedShutdowns.length > 0) {
      ServicesCores.Logger.error(
        `An error occurred during shutdown: ${failedShutdowns.reduce((acc, val) => acc + '\n' + val, '\n')}`,
        { labels: { service: 'Shutdown' } }
      )
      process.exit(1)
    } else {
      ServicesCores.Logger.info('Application stopped', { labels: { service: 'Shutdown' } })
      process.exit(0)
    }
  }

  /**
   * Call setPlugin() for each plugin and set up a listener on the exit event.
   */
  async setPlugins () {
    ServicesCores.Logger.info('Plugins initialization', { labels: { service: 'Startup' } })

    // Set the plugins configuration.
    this.plugins.forEach((plugin) => {
      this.setPlugin(plugin)
    })

    // If there were any configuration errors, log the issues and exit the process.
    if (this.configCheckErrors.length > 0) {
      const errors = this.configCheckErrors.reduce((acc, val) => {
        acc = acc + val + '\n'
        return acc
      }, '\n')
      ServicesCores.Logger.error(`Application configuration error, missing the following: ${errors}`, { labels: { service: 'Startup' } })
      process.exit(1)
    }

    // Instantiate the plugins
    const failedStarts = []
    await Promise.all(this.instances.map(async ({ inst }) => {
      try {
        await inst.start()
      } catch {
        failedStarts.push(`Failed to start plugin ${inst.getPrefixEnv()}`)
      }
    }))

    if (failedStarts.length > 0) {
      ServicesCores.Logger.info(
        `Application failed to start: ${failedStarts.reduce((acc, val) => acc + '\n' + val, '\n')}`,
        { labels: { service: 'Startup' } }
      )
      process.exit(1)
    } else {
      ServicesCores.Logger.info('Application running', { labels: { service: 'Startup' } })
    }

    // Handle exit event.
    process.on('exit', () => {
      this.stopPlugins(this.instances)
    })
  }
}

export default MetricAclCore
