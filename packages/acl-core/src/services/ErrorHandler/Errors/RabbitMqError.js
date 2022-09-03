import MetricBaseError from './MetricBaseError'

export default class RabbitMqError extends MetricBaseError {
  constructor (params) {
    super(params)
    this.host = params.host
    this.user = params.user
    this.pwd = params.pwd
    this.queue = params.queue
  }

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.labels.service = 'RabbitMQ'
    error.labels.host = this.host
    error.labels.user = this.user
    error.labels.pwd = this.pwd
    error.labels.queue = this.queue

    return error
  }
}
