import BaseMapper from './BaseMapper'

export default class SpecSectionItemMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'definition', rabbitMqField: 'Definition', aclField: 'specificationItemDefinitionId' }
    ]
  }
}
