import BaseMapper from './BaseMapper'

const attributesIdConverter = () => (inputField) => {
  if ((typeof inputField) === 'string' && inputField.includes('ATT_')) {
    return inputField.match(/(ATT)\w+/g)[0]
  }
  return null
}

export default class SpecItemDefinitionMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'node_name', rabbitMqField: 'Node Name', aclField: 'modelStepAttributeName' },
      { apiField: 'node_name', rabbitMqField: 'Node Name', aclField: 'attributesId', converter: attributesIdConverter() }
    ]
  }
}
