import BaseMapper from './BaseMapper'

export default class MerchCollectionVersionMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'adeo_merch_collection_version_sales_creation_double', rabbitMqField: 'ADEO_MerchCollectionVersion_SalesCreation_double', aclField: 'briefProjectSalesCreation' },
      { apiField: 'adeo_merch_collection_version_roi_double', rabbitMqField: 'ADEO_MerchCollectionVersion_ROI_double', aclField: 'briefROIInYear' },
      { apiField: 'adeo_merch_collection_version_ressource_cost_double', rabbitMqField: 'ADEO_MerchCollectionVersion_RessourceCost_double', aclField: 'briefDevelopmentCostsHumanResources' },
      { apiField: 'adeo_merch_collection_version_project_sales_per_store_at_ttm_double', rabbitMqField: 'ADEO_MerchCollectionVersion_ProjectSalesPerStoreAtTTM_double', aclField: 'projectSalesPerStoreAtTttm' },
      { apiField: 'adeo_merch_collection_version_project_percentage_sales_i1_i2_double', rabbitMqField: 'ADEO_MerchCollectionVersion_ProjectPercentageSalesI1I2_double', aclField: 'briefProjectSalesI1I2Rate' },
      { apiField: 'adeo_merch_collection_version_project_nb_reference_i1_int', rabbitMqField: 'ADEO_MerchCollectionVersion_ProjectNbReferenceI1_int', aclField: 'briefGlobalNumberOfMatrixIdI1' },
      { apiField: 'adeo_merch_collection_version_project_nb_reference_i2_int', rabbitMqField: 'ADEO_MerchCollectionVersion_ProjectNbReferenceI2_int', aclField: 'briefGlobalNumberOfMatrixIdI2' },
      { apiField: 'adeo_merch_collection_version_project_nb_reference_int', rabbitMqField: 'ADEO_MerchCollectionVersion_ProjectNbReference_int', aclField: 'briefGlobalNumberOFMatrixId' },
      { apiField: 'adeo_merch_collection_version_projection_sales_full_year_ttm_double', rabbitMqField: 'ADEO_MerchCollectionVersion_ProjectionSalesFullYearTTM_double', aclField: 'briefTurnoverProjectProjection' },
      { apiField: 'adeo_merch_collection_version_projection_qtity_of_bu_int', rabbitMqField: 'ADEO_MerchCollectionVersion_ProjectionQtityOfBU_int', aclField: 'briefProjectionQuantityOfBU' },
      { apiField: 'adeo_merch_collection_version_projection_extra_margin_double', rabbitMqField: 'ADEO_MerchCollectionVersion_ProjectionExtraMargin_double', aclField: 'briefNewSaleExtraMargin' },
      { apiField: 'adeo_merch_collection_version_overhead_cost_double', rabbitMqField: 'ADEO_MerchCollectionVersion_OverheadCost_double', aclField: 'briefDvptCostsOverheads' },
      { apiField: 'adeo_merch_collection_version_list_of_bu_projection_string', rabbitMqField: 'ADEO_MerchCollectionVersion_ListOfBUProjection_string', aclField: 'briefListOfBu' },
      { apiField: 'adeo_merch_collection_version_implement_cost_double', rabbitMqField: 'ADEO_MerchCollectionVersion_ImplementCost_double', aclField: 'briefImplementationCostsBuAndAdeo' },
      { apiField: 'adeo_merch_collection_version_brief_purchasing_gains_double', rabbitMqField: 'ADEO_MerchCollectionVersion_BriefPurchasingGains_double', aclField: 'briefPurchasingGain' },
      { apiField: 'adeo_merch_collection_version_brief_purchase_gains_rate_double', rabbitMqField: 'ADEO_MerchCollectionUp_BriefPurchaseGainsRate_double', aclField: 'briefPurchaseGainRate' },
      { apiField: 'adeo_merch_collection_up_projection_sales_full_year_ttm_double', rabbitMqField: 'ADEO_MerchCollectionUp_ProjectionSalesFullYearTTM_double', aclField: 'briefTurnoverSalesFullYearProjection' },
      { apiField: 'adeo_merch_collection_up_projection_extra_margin_double', rabbitMqField: 'ADEO_MerchCollectionUp_ProjectionExtraMargin_double', aclField: 'briefExtraMarginFromNewSales' },
      { apiField: 'adeo_merch_collection_up_brief_purchase_amount_double', rabbitMqField: 'ADEO_MerchCollectionUp_BriefPurchaseAmount_double', aclField: 'briefPurchasingAmount' },
      { apiField: 'adeo_merch_collection_up_existing_perimeter_to_double', rabbitMqField: 'ADEO_MerchCollectionUp_ExistingPerimeterTO_double', aclField: 'briefTurnoverSalesFullYearExistingPerimeter' }
    ]
  }
}
