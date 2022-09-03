import BaseMapper from './BaseMapper'

export default class RoleMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', rabbitMqField: 'id', aclField: 'id' },
      { apiField: 'node_name', rabbitMqField: 'NodeName', aclField: 'name' }
    ]
  }
}
