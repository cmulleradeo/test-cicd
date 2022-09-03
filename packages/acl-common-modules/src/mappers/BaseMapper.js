/* eslint-disable security/detect-unsafe-regex */
/**
 * Base class for all the mappers.
 */
export default class BaseMapper {
  mapping = []

  /**
   * Convert a RabbitMQ/Kafka message to the ACL data format.
   *
   * @param {object} rabbitMqMessage The RabbitMQ/Kafka message.
   * @param {number} rabbitMqMessage.id Identifier of the entity to update.
   * @param {object[]} rabbitMqMessage.attributes Array containing the attributes of the message.
   * @returns {object} The converted RabbitMQ message.
   */
  convertMessageToAclData = (rabbitMqMessage) => {
    const aclData = this.convertToAclData(rabbitMqMessage.attributes)

    return {
      id: rabbitMqMessage.id,
      ...aclData
    }
  }

  convertApiToAclData = (apiResponse) => {
    return this.convertToAclData(apiResponse)
  }

  /**
   * Convert a RabbitMQ/Kafka message to the ACL data format.
   *
   * @param {object} data Source data to convert to ACL format.
   * @returns {object} The converted RabbitMQ message.
   */
  convertToAclData = (data) => {
    const aclData = {}

    /* eslint-disable security/detect-object-injection */
    Object.keys(data).forEach((key) => {
      // Get the mapping matching the current field
      const fieldMappings = this.mapping.filter((element) => element.rabbitMqField === key || element.apiField === key)
      if (!fieldMappings) return

      fieldMappings.forEach((fieldMapping) => {
        aclData[fieldMapping.aclField] = this.convert(fieldMapping, key, data)
      })
    })
    /* eslint-disable security/detect-object-injection */

    return aclData
  }

  convert = (fieldMapping, key, data) => {
    let value
    // Check if the mapping has an accessor method and use it to fetch the rabbitmq value.
    if (fieldMapping.accessor) {
      value = fieldMapping.accessor(data)
    } else {
      if ((key.endsWith('_ref') || key === 'responsible_party' || key === 'ResponsibleParty' || key === 'value_lookup_item') && data[key] === 1) {
        value = null
      } else {
        value = data[key]
      }
    }

    // Check if the mapping has a converter method and use it to convert the rabbitmq value
    if (fieldMapping.converter) {
      value = fieldMapping.converter(value)
    }

    const defaultDateRegex = /1970-01-01T00:00:00(.\d{3})?Z/
    if (value === '' || defaultDateRegex.test(value)) {
      value = null
    }

    // The field is a date, set the time to 0 and add one day
    const dateField = new Date(value)
    const dateRegexp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/
    if (dateRegexp.test(value)) {
      dateField.setUTCHours(0)
      dateField.setUTCDate(dateField.getUTCDate() + 1)
      value = dateField.toISOString()
    }

    return value
  }

  /**
   * Get the ACL field for the given RabbitMQ/Kafka field.
   *
   * @param {string} rabbitMqField The RabbitMQ/Kafka field.
   * @returns {string} The ACL field.
   */
  getAclFieldForMessageMapping = (rabbitMqField) => {
    return this.mapping.find((element) => element.rabbitMqField === rabbitMqField)?.aclField
  }
}
