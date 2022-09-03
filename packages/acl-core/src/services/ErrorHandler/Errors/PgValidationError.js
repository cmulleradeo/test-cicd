import MetricBaseError from './MetricBaseError'

export default class PgValidationError extends MetricBaseError {
  /**
   * Instanciate a new PgValidationError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   * @param {string} params.validationErrors Postgres Model Validation Errors
   */
  constructor (params) {
    super(params)
    this.validationErrors = params.validationErrors
  }

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.labels.service = 'SQL'

    return error
  }

  /** @inheritdoc */
  formatMessage = () => {
    return `${this.message}: ${JSON.stringify(this.validationErrors)}`
  }
}
