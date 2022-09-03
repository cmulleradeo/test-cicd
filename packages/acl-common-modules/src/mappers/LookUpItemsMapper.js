import BaseMapper from './BaseMapper'

export default class LookUpItemsMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', rabbitMqField: 'id', aclField: 'id' },
      { apiField: 'code', rabbitMqField: 'Code', aclField: 'code' }
    ]
  }
}
