import BaseMapper from './BaseMapper'

export default class UserMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', rabbitMqField: 'id', aclField: 'id' },
      { apiField: 'email', rabbitMqField: 'email', aclField: 'email' },
      { apiField: 'user_id', rabbitMqField: 'UserID', aclField: 'ldap' },
      { apiField: 'node_name', rabbitMqField: 'Node Name', aclField: 'name' }
    ]
  }
}
