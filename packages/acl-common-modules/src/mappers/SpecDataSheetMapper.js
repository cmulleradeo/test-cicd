import BaseMapper from './BaseMapper'

export default class SpecDataSheetMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'current_revision', rabbitMqField: 'CurrentRevision', aclField: 'currentRevisionId' }
    ]
  }
}
