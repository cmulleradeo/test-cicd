import BaseMapper from './BaseMapper'

export default class SpecDataSheetRevisionItemMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: 'specDataSheetRevisionId', rabbitMqField: 'specDataSheetRevisionId', aclField: 'specDataSheetRevisionId' },
      { apiField: 'specDataSheetItemId', rabbitMqField: 'specDataSheetItemId', aclField: 'specDataSheetItemId' }
    ]
  }
}
