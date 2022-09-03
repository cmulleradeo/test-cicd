import MetricBaseError from './MetricBaseError'

export default class KafkaError extends MetricBaseError {
  /**
   * Instanciate a new GoogleStorageError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   * @param {string} params.kafkaTopic Topic of the messages for Kafka.
   * @param {string[]} params.kafkaMessages Messages for Kafka.
   */
  constructor (params) {
    super(params)
    this.kafkaTopic = params.kafkaTopic
    this.kafkaMessages = params.kafkaMessages
  }

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.labels.topic = this.kafkaTopic
    error.labels.messages = this.kafkaMessages
    error.labels.service = 'Kafka'
    return error
  }
}
