import MetricBaseError from './MetricBaseError'

export default class DatadogError extends MetricBaseError {
  /**
   * Instanciate a new DatadogError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   * @param {string} params.metric Name of the metric.
   */
  constructor (params) {
    super(params)

    this.metric = params.metric
  }

  /** @inheritdoc */
  formatMessage = () => `An error occured while sending the metric ${this.metric}: ${this.message}`

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.labels.metric = this.metric
    error.labels.service = 'Datadog'
    return error
  }
}
