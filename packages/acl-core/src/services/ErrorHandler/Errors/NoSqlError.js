import MetricBaseError from './MetricBaseError'

export default class NoSqlError extends MetricBaseError {
  /**
   * Instanciate a new NoSqlError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   * @param {string} params.host URL of the NoSQL host.
   * @param {string} params.database Name of the NoSQL database.
   * @param {string} params.dbUser User connected to the NoSQL database.
   */
  constructor (params) {
    super(params)
    this.host = params.host
    this.database = params.database
    this.dbUser = params.dbUser
  }

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.labels.host = this.host
    error.labels.database = this.database
    error.labels.dbUser = this.dbUser

    return error
  }
}
