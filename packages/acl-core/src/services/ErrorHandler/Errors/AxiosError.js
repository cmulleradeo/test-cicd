import MetricBaseError from './MetricBaseError'

export default class AxiosError extends MetricBaseError {
  constructor (params) {
    super(params)
    this.status = params.status
    this.statusuText = params.statusText
    this.url = params.url
    this.data = params.data
  }

  /** @inheritdoc */
  formatError = () => {
    const error = super.formatError()
    error.labels.service = 'Axios'
    error.labels.status = this.status
    error.labels.statusText = this.statusText
    error.labels.url = this.url
    error.labels.data = this.data
    return error
  }
}
