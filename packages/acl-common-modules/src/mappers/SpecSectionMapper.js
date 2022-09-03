import BaseMapper from './BaseMapper'

export default class SpecSectionMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'adeo_spec_section_stepid_string', rabbitMqField: 'ADEO_SpecSection_STEPID_string', aclField: 'ModelStepId' },
      { apiField: 'description', rabbitMqField: 'Description', aclField: 'ModelStepName' }
    ]
  }
}
