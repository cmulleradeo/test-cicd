import MetricBaseError from './MetricBaseError'

export default class SchemaRegistryError extends MetricBaseError {
  /**
   * Instanciate a new SchemaRegistryError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   * @param {object[]} params.schemaId Id of the Avro schema.
   * @param {object[]} params.schemaName Name of the Avro schema.
   * @param {object[]} params.payload The payload to encode.
   */
  constructor (params) {
    super(params)
    this.schemaId = params.schemaId
    this.schemaName = params.schemaName
    this.payload = params.payload
  }

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.labels.schemaId = this.schemaId
    error.labels.schemaName = this.schemaName
    error.labels.payload = this.payload
    error.labels.service = 'Kafka'
    return error
  }
}
