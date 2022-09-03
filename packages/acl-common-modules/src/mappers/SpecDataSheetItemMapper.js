import BaseMapper from './BaseMapper'

export default class SpecDataSheetItemMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'adeo_spec_data_sheet_item_selected_value_string', rabbitMqField: 'ADEO_SpecDataSheetItem_SelectedValue_String', aclField: 'modelAttributeValue' },
      { apiField: 'actual', rabbitMqField: 'Actual', aclField: 'specificationSectionItemId' },
      { apiField: 'value_lookup_item', rabbitMqField: 'ValueLookupItem', aclField: 'lookupItemId' }
    ]
  }
}
