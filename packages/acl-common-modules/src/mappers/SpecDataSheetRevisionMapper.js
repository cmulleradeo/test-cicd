import BaseMapper from './BaseMapper'

const sectionConverter = (inputField) => {
  return inputField.length && inputField.length > 0
    ? inputField[0]
    : null
}

export default class SpecDataSheetRevisionMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'all_sections', rabbitMqField: 'AllSections', converter: sectionConverter, aclField: 'specificationSectionId' }
    ]
  }
}
