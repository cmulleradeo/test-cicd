import collections from './__api__/collection'
import merchCollectionVersions from './__api__/merchCollectionVersions'
import merchSecondaryVersions from './__api__/merchSecondaryVersions'

const initModules = {}

initModules.MetricApiHelper = class MetricApiHelper {
  getData = (endpoint) => {
    let data
    switch (endpoint) {
      case 'merch_secondary_versions':
        data = merchSecondaryVersions
        break
    }

    return {
      data,
      allDataReturned: true
    }
  }

  getAllCollections = () => ({ collections })

  getAllMerchCollectionVersions = () => ({ merchCollectionVersions })

  getAllMerchSecondaryVersions = () => ({ merchSecondaryVersions })
}

initModules.MetricApiEndpoints = {
  merch_secondary_versions: 'merch_secondary_versions'
}

initModules.__getCollections__ = () => collections
initModules.__getMerchCollectionVersions__ = () => merchCollectionVersions
initModules.__getMerchSecondaryVersions__ = () => merchSecondaryVersions

module.exports = initModules
