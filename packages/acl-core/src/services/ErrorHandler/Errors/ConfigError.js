import MetricBaseError from './MetricBaseError'

export default class ConfigError extends MetricBaseError {
  /**
   * Instanciate a new MetricBaseError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   * @param {string[]} params.config List of the config missing.
   */
  constructor (params) {
    super(params)
    this.config = params.config
  }

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.config = this.config
    return error
  }
}
