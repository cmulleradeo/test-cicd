/*
 * Base class for all the Errors thrown by Metric ACL.
 */
export default class MetricBaseError extends Error {
  /**
   * Instanciate a new MetricBaseError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   */
  constructor (params) {
    super(params.message)
    this.stack = params.stack
    this.stream = params.stream
    this.feature = params.feature
    this.labels = {
      plugin: params.name,
      ...params.labels
    }
  }

  /**
   * Format the error message.
   *
   * @returns {string} The message for the error
   */
  formatMessage = () => {
    return this.message
  }

  /**
   * Format the additional informations about the error.
   *
   * @returns {object} JSON object containing the additional informations.
   */
  formatError () {
    return {
      stream: this.stream,
      feature: this.feature,
      labels: this.labels,
      exception: this.stack
    }
  }
}
