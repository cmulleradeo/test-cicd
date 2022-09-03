import axios from 'axios'

import MetricApiEndpoints from '../constants/MetricApiEndpoints'

/**
 * Helper class to manage the calls to the Metric API.
 *
 * @requires axios
 */
export default class MetricApiHelper {
  constructor (logger, logInfos, config, errorHandler) {
    this.logInfos = logInfos
    this.logger = logger
    this.config = config
    this.DEFAULT_API_LIMIT = 1000

    const url = new URL(config.API_HOST)
    url.pathname = 'v1/data'

    this.axiosInstance = axios.create({ baseURL: url.href })

    // Request interceptor to log the call to the API.
    this.axiosInstance.interceptors.request.use((configuration) => {
      this.logger.debug(`>>>> API request: ${configuration.method} ${configuration.baseURL}/${configuration.url}?skip=${configuration.params.skip}&limit=${configuration.params.limit}`, this.logInfos)
      return configuration
    })

    // Response interceptor to log the status of the response and manage the response errors.
    this.axiosInstance.interceptors.response.use((response) => {
      this.logger.debug(`<<<< API response: ${response.status} ${response.config.baseURL}/${response.config.url}`, this.logInfos)
      return response
    }, (error) => {
      if (error.response) {
        throw new errorHandler.AxiosError({
          message: `Received the error ${error.response.status} ${error.response.statusText}: ${error.response.data.message}`,
          status: error.response.status,
          statusText: error.response.statusText,
          url: error.response.config,
          ...this.logInfos
        })
      } else {
        throw new Error(`An error occured while making an API call: ${error}`)
      }
    })
  }

  /**
   * Get the data from the Metric API using the configured limit.
   *
   * @param {string} endpoint Endpoint of the Metric API to call.
   * @param {number} skip Number of elements to skip.
   * @param {number} limit Maximum number of element to fetch from the API.
   * @returns {object[]} An array containing the result from the API.
   */
  getData = async (endpoint, skip = 0, limit = this.DEFAULT_API_LIMIT) => {
    const { data } = await this.axiosInstance.get(endpoint, { params: { skip, limit } })
    return {
      data,
      allDataReturned: data.length < limit
    }
  }

  /**
   * Get all the data from the Metric API using the configured limit and recursive calls.
   *
   * @param {string} endpoint Endpoint of the Metric API to call.
   * @param {number} skip Number of elements to skip.
   * @param {number} limit Maximum number of element to fetch from the API.
   * @returns {object[]} An array containing the concatenation of the results from the API.
   */
  getAllData = async (endpoint, skip = 0, limit = this.DEFAULT_API_LIMIT) => {
    const { data } = await this.axiosInstance.get(endpoint, { params: { skip, limit } })

    if (data.length < limit) {
      return data
    } else {
      const nextData = await this.getAllData(endpoint, skip + limit, limit)
      return data.concat(nextData)
    }
  }

  /**
   * Get all the collection entities from the Metric API.
   *
   * @returns {object[]} An array containing all the collection entities.
   */
  getAllCollections = async () => { return { collections: await this.getAllData(MetricApiEndpoints.collections) } }

  /**
   * Get all the category1 entities from the Metric API.
   *
   * @returns {object[]} An array containing all the category1 entities.
   */
  getAllCategory1 = async () => { return { category1: await this.getAllData(MetricApiEndpoints.category1s) } }

  /**
   * Get all the category2 entities from the Metric API.
   *
   * @returns {object[]} An array containing all the category2 entities.
   */
  getAllCategory2 = async () => { return { category2: await this.getAllData(MetricApiEndpoints.category2s) } }

  /**
   * Get all the seasons entities from the Metric API.
   *
   * @returns {object[]} An array containing all the category2 entities.
   */
  getAllSeasons = async () => { return { season: await this.getAllData(MetricApiEndpoints.seasons) } }

  /**
   * Get all the user entities from the Metric API.
   *
   * @returns {object[]} An array containing all the user entities.
   */
  getAllRoles = async () => { return { roles: await this.getAllData(MetricApiEndpoints.roles) } }

  /**
   * Get all the user entities from the Metric API.
   *
   * @returns {object[]} An array containing all the user entities.
   */
  getAllUsers = async () => { return { users: await this.getAllData(MetricApiEndpoints.users) } }

  /**
   * Get all the activity entities from the Metric API.
   *
   * @returns {object[]} An array containing all the activity entities.
   */
  getAllActivities = async () => { return { activities: await this.getAllData(MetricApiEndpoints.activities) } }

  /**
   * Get all the calendars entities from the Metric API.
   *
   * @returns {object[]} An array containing all the activity entities.
   */
  getAllCalendars = async () => { return { calendars: await this.getAllData(MetricApiEndpoints.calendars) } }

  /**
   * Get all the merch secondary version entities from the Metric API.
   *
   * @param {number} limit Maximum amount of element to fetch.
   * @returns {object[]} An array containing all the merch secondary version entities.
   */
  getAllMerchSecondaryVersions = async (limit) => { return { merchSecondaryVersions: await this.getAllData(MetricApiEndpoints.merch_secondary_versions, 0, limit) } }

  /**
   * Get all the specification section entities from the Metric API.
   *
   * @returns {object[]} An array containing all the specification section entities.
   */
  getAllSpecSections = async () => { return { specSections: await this.getAllData(MetricApiEndpoints.specification_sections) } }

  /**
   * Get all the specification data sheet item entities from the Metric API.
   *
   * @param {number} limit Maximum amount of element to fetch.
   * @returns {object[]} An array containing all the specification data sheet item entities.
   */
  getAllSpecDataSheetItems = async (limit) => { return { specDataSheetItems: await this.getAllData(MetricApiEndpoints.specification_data_sheet_items, 0, limit) } }

  /**
   * Get all the specification section item entities from the Metric API.
   *
   * @param {number} limit Maximum amount of element to fetch.
   * @returns {object[]} An array containing all the specification section item entities.
   */
  getAllSpecSectionItems = async (limit) => { return { specSectionItems: await this.getAllData(MetricApiEndpoints.specification_section_items, 0, limit) } }

  /**
   * Get all the specification item definition entities from the Metric API.
   *
   * @returns {object[]} An array containing all the specification item definition entities.
   */
  getAllSpecSectionItemDefinitions = async () => { return { specItemDefinitions: await this.getAllData(MetricApiEndpoints.specification_item_definitions) } }

  /**
   * Get all the style entities from the Metric API.
   *
   * @returns {object[]} An array containing all the style entities.
   */
  getAllStyles = async () => { return { styles: await this.getAllData('styles') } }

  /**
   * Get all the specification data sheet entities from the Metric API.
   *
   * @returns {object[]} An array containing all the specification data sheet entities.
   */
  getAllSpecDataSheets = async () => { return { specDataSheets: await this.getAllData('specification_data_sheets') } }

  /**
   * Get all the specification data sheet revision entities from the Metric API.
   *
   * @returns {object[]} An array containing all the specification data sheet revision entities.
   */
  getAllSpecDataSheetRevisions = async () => { return { specDataSheetRevisions: await this.getAllData('specification_data_sheet_revisions') } }

  /**
   * Get all the classifier3 entities from the Metric API.
   *
   * @returns {object[]} An array containing all the classifier3 entities.
   */
  getAllClassifier3 = async () => { return { classifier3: await this.getAllData('classifier3s') } }

  /**
   * Get all the product symbol entities from the Metric API.
   *
   * @returns {object[]} An array containing all the product symbol entities.
   */
  getAllProductSymbols = async () => { return { productSymbols: await this.getAllData('product_symbols') } }

  /**
   * Get all the merch collection versions entities from the Metric API.
   *
   * @returns {object[]} An array containing all the merch collection versions entities.
   */
  getAllMerchCollectionVersions = async () => { return { merchCollectionVersions: await this.getAllData('merch_collection_versions') } }

  /**
   * Get all the merch secondary plans entities from the Metric API.
   *
   * @returns {object[]} An array containing all the merch secondary plans entities.
   */
  getAllMerchSecondaryPlans = async () => { return { merchSecondaryPlans: await this.getAllData('merch_secondary_plans') } }

  /**
   * Get all the merch product version entities from the Metric API.
   *
   * @returns {object[]} An array containing all the merch secondary plans entities.
   */
  getAllMerchProductVersions = async () => { return { merchProductVersions: await this.getAllData('merch_product_versions') } }

  /**
   * Get all the lookup items version entities from the Metric API.
   *
   * @returns {object[]} An array containing all the merch secondary plans entities.
   */
  getAllLookUpItems = async () => { return { lookUpItems: await this.getAllData('lookup_items') } }
}
