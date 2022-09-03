import BaseMapper from './BaseMapper'

export default class StyleBrandMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: 'styleId', rabbitMqField: 'id', aclField: 'styleId' },
      { apiField: 'productSymbolId', rabbitMqField: 'productSymbolId', aclField: 'productSymbolId' }
    ]
  }
}
