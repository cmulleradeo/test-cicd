import sqlModels from './sqlModels'
import constants from './constants'
import mappers from './mappers'
import SqlHelper from './sqlHelper'

/**
 * Generate logs metadata from plugin and side informations.
 *
 * @param {object} pluginInfos - Plugin information.
 * @param {string} [pluginInfos.name] - Plugin name information.
 * @param {string} [pluginInfos.stream] - Plugin stream information.
 * @param {string} [pluginInfos.feature] - Plugin feature information.
 * @param {object} [labels] - Labels for log.
 * @param {object} [exception] - Expection for log.
 * @returns {object} log informations.
 */
const generateLogInfos = (pluginInfos, labels = {}, exception = null) => {
  return {
    feature: pluginInfos?.feature,
    stream: pluginInfos?.stream,
    labels: {
      plugin: pluginInfos?.name,
      ...labels
    },
    exception
  }
}

export {
  sqlModels,
  constants,
  mappers,
  generateLogInfos,
  SqlHelper
}
