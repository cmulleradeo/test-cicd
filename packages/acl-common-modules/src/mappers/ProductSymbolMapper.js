import BaseMapper from './BaseMapper'

export default class ProductSymbolMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'node_name', rabbitMqField: 'Node Name', aclField: 'brandName' },
      { apiField: 'adeo_product_symbol_id_string', rabbitMqField: 'ADEO_ProductSymbol_ID_string', aclField: 'brandId' }
    ]
  }
}
