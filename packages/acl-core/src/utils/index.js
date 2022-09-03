import _ from 'lodash'

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
    feature: pluginInfos.feature,
    stream: pluginInfos.stream,
    labels: {
      plugin: pluginInfos.name,
      ...labels
    },
    exception
  }
}

/**
 * Fonction permettant de retourner l'index d'un item de tableau en fonction des informations de plugin transmises
 * Utilisée dans le cadre du tableau sequelizes du service SQL
 * utiliser cette fonction pour le tableau producers du service Kafka Producer
 *
 * @param {object} array Tableau sur lequel opérer
 * @param {object} pluginInfos Informations de plugin transmises
 * @returns {number} Index
 */
const findIndex = (array, pluginInfos) => {
  return _.findIndex(array, (value) => {
    return value.pluginName === pluginInfos.name && value.version === pluginInfos.version
  })
}

export default {
  findIndex,
  generateLogInfos
}
