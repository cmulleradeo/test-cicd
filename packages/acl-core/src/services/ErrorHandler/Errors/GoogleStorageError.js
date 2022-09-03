import MetricBaseError from './MetricBaseError'

export default class GoogleStorageError extends MetricBaseError {
  /**
   * Instanciate a new GoogleStorageError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   * @param {string} params.bucket Name of the bucket.
   * @param {string} params.file Name of the file.
   */
  constructor (params) {
    super(params)

    this.bucket = params.bucket
    this.file = params.file
  }

  /** @inheritdoc */
  formatError () {
    const error = super.formatError()
    error.labels.bucket = this.bucket
    error.labels.file = this.file
    error.labels.service = 'GCS'

    return error
  }
}
