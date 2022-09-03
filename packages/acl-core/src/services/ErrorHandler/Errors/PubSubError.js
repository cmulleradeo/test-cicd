import MetricBaseError from './MetricBaseError'

export default class PubSubError extends MetricBaseError {
  /**
   * Instanciate a new PubSubError.
   *
   * @param {object} params Input parameters.
   * @param {string} params.message The error message.
   * @param {string?} params.stack The error stack trace.
   * @param {string} params.stream Stream of the plugin.
   * @param {string} params.feature Feature of the plugins.
   * @param {object[]} params.label Additionnal labels to log along with the error.
   * @param {string} params.topic The PubSub topic.
   * @param {string} params.subscription The PubSub subscription.
   * @param {string} params.pubSubMessage The message sent to PubSub.
   */
  constructor (params) {
    super(params)

    this.topic = params.topic
    this.subscription = params.subscription
    this.pubSubMessage = params.pubSubMessage
  }

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.labels.service = 'PubSub'
    error.labels.topic = this.topic
    error.labels.subscription = this.subscription
    error.labels.pubSubMessage = this.pubSubMessage

    return error
  }
}
