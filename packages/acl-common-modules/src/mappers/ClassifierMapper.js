import BaseMapper from './BaseMapper'

export default class ClassifierMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'node_name', rabbitMqField: 'Node Name', aclField: 'nodeName' }
    ]
  }
}
