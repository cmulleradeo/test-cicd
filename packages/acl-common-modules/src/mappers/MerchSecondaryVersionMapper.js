import BaseMapper from './BaseMapper'
import buConverter from './converters/buConverter'

const categoryConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_Category:Customer Study': return 'Customer Study'
    case 'ADEO_Category:Conception': return 'Conception'
    case 'ADEO_Category:Quality': return 'Quality'
    case 'ADEO_Category:PackagingCom': return 'PackagingCom'
    case 'ADEO_Category:Packing': return 'Packing'
    case 'ADEO_Category:Notice': return 'Notice'
    case 'ADEO_Category:Other': return 'Other'
    case 'ADEO_Category:CPLeader': return 'CPLeader'
    case 'ADEO_Category:TrendCustomerKnowledge': return 'TrendCustomerKnowledge'
    case 'ADEO_Category:Products': return 'Products'
    case 'ADEO_Category:IndustrialConception': return 'IndustrialConception'
    case 'ADEO_Category:SupplyChain': return 'SupplyChain'
    case 'ADEO_Category:Purchasing': return 'Purchasing'
    case 'ADEO_Category:Others': return 'Others'
    default: return null
  }
}
const expectedMerchandisingConverter = (rabbitMqField) => {
  switch (rabbitMqField) {
    case 'ADEO_Merchandising:Basket':
      return 'Basket'
    case 'ADEO_Merchandising:Cut Case':
      return 'Cut Case'
    case 'ADEO_Merchandising:Hook':
      return 'Hook'
    case 'ADEO_Merchandising:Pallet':
      return 'Pallet'
    case 'ADEO_Merchandising:Shelf':
      return 'Shelf'
    default: return null
  }
}

const expectedRangeLetterConverter = (rabbitMqField) => {
  switch (rabbitMqField) {
    case 'ADEO_RangeLetter:A':
      return 'A'
    case 'ADEO_RangeLetter:B':
      return 'B'
    case 'ADEO_RangeLetter:C':
      return 'C'
    case 'ADEO_RangeLetter:L':
      return 'L'
    case 'ADEO_RangeLetter:P':
      return 'P'
    case 'ADEO_RangeLetter:Ac':
      return 'Ac'
    case 'ADEO_RangeLetter:Bc':
      return 'Bc'
    case 'ADEO_RangeLetter:D':
      return 'D'
    case 'ADEO_RangeLetter:E':
      return 'E'
    case 'ADEO_RangeLetter:ET':
      return 'ET'
    case 'ADEO_RangeLetter:F':
      return 'F'
    case 'ADEO_RangeLetter:H':
      return 'H'
    case 'ADEO_RangeLetter:K':
      return 'K'
    case 'ADEO_RangeLetter:M':
      return 'M'
    case 'ADEO_RangeLetter:N':
      return 'N'
    case 'ADEO_RangeLetter:Q':
      return 'Q'
    case 'ADEO_RangeLetter:R':
      return 'R'
    case 'ADEO_RangeLetter:S':
      return 'S'
    case 'ADEO_RangeLetter:T':
      return 'T'
    case 'ADEO_RangeLetter:U':
      return 'U'
    case 'ADEO_RangeLetter:X':
      return 'X'
    case 'ADEO_RangeLetter:Z':
      return 'Z'
    default: return null
  }
}

const expectedDeliveryPromiseOnlineConverter = (rabbitMqField) => {
  switch (rabbitMqField) {
    case 'ADEO_DeliveryPromiseOnline:010':
      return 'Web 24h'
    case 'ADEO_DeliveryPromiseOnline:020':
      return 'Web 48h'
    case 'ADEO_DeliveryPromiseOnline:030':
      return 'Web 5 days'
    case 'ADEO_DeliveryPromiseOnline:040':
      return 'Web > 7 days'
    default: return null
  }
}

const expectedDeliveryPromisePhysicalConverter = (rabbitMqField) => {
  switch (rabbitMqField) {
    case 'ADEO_DeliveryPromisePhysical:010':
      return 'Displayed on store stock LS Immediat'
    case 'ADEO_DeliveryPromisePhysical:020':
      return 'Displayed on store stock EM Immediat'
    case 'ADEO_DeliveryPromisePhysical:030':
      return 'Displayed on store customer order 24h'
    case 'ADEO_DeliveryPromisePhysical:040':
      return 'Displayed on store customer order 48h'
    case 'ADEO_DeliveryPromisePhysical:050':
      return 'Displayed on store customer order 5 days'
    case 'ADEO_DeliveryPromisePhysical:060':
      return 'Displayed on store customer order > 7 days'
    case 'ADEO_DeliveryPromisePhysical:070':
      return 'Not displayed on store customer order 24h'
    case 'ADEO_DeliveryPromisePhysical:080':
      return 'Not displayed on store customer order 48h'
    case 'ADEO_DeliveryPromisePhysical:090':
      return 'Not displayed on store customer order 5 days'
    case 'ADEO_DeliveryPromisePhysical:100':
      return 'Not displayed on store customer order > 7 days'
    default: return null
  }
}

const currentNewProductionConverter = (rabbitMqField) => {
  switch (rabbitMqField) {
    case 'ADEO_YesNo:No':
      return 'No'
    case 'ADEO_YesNo:Yes':
      return 'Yes'
    default: return null
  }
}

const EntierConverter = (rabbitMqField) => {
  return Math.round(rabbitMqField)
}

const Decimal2Converter = (rabbitMqField) => {
  return rabbitMqField.toFixed(2)
}

const PercentConverter = (rabbitMqField) => {
  return (rabbitMqField * 100).toFixed(2)
}

export default class MerchSecondaryVersionMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'plan_secondary', rabbitMqField: 'PlanSecondary', aclField: 'merchSecondaryPlanId' },
      { apiField: 'adeo_merch_second_ver_secondary_type_string', rabbitMqField: 'ADEO_MerchSecondVer_SecondaryType_string', aclField: 'secondaryType' },
      { apiField: 'adeo_merch_second_ver_ressource_total_days_double', rabbitMqField: 'ADEO_MerchSecondVer_RessourceTotalDays_double', aclField: 'resourceTotalDays' },
      { apiField: 'adeo_office_leader', rabbitMqField: 'ADEO_OfficeLeader', aclField: 'officeLeader' },
      { apiField: 'adeo_office_challenger', rabbitMqField: 'ADEO_OfficeChallenger', aclField: 'officeChallenger' },
      { apiField: 'adeo_merch_second_ver_whos_in_string', rabbitMqField: 'ADEO_MerchSecondVer_WhosIn_string', aclField: 'whosIn' },
      { apiField: 'adeo_merch_second_ver_category_enum', rabbitMqField: 'ADEO_MerchSecondVer_Category_enum', converter: categoryConverter, aclField: 'resourceCategory' },
      { apiField: 'adeo_merch_second_ver_o_vor_ressource_y_double', rabbitMqField: 'ADEO_MerchSecondVer_OVorRessourceY_double', aclField: 'OVorRessourceY' },
      { apiField: 'adeo_merch_second_ver_o_vor_ressource_y1_double', rabbitMqField: 'ADEO_MerchSecondVer_OVorRessourceY1_double', aclField: 'OVorRessourceY1' },
      { apiField: 'adeo_merch_second_ver_o_vor_ressource_y2_double', rabbitMqField: 'ADEO_MerchSecondVer_OVorRessourceY2_double', aclField: 'OVorRessourceY2' },
      { apiField: 'adeo_merch_second_ver_o_vor_ressource_y3_double', rabbitMqField: 'ADEO_MerchSecondVer_OVorRessourceY3_double', aclField: 'OVorRessourceY3' },
      { apiField: 'adeo_merch_second_ver_total_cost_double', rabbitMqField: 'ADEO_MerchSecondVer_TotalCost_double', aclField: 'totalCost' },
      // brief bu
      { apiField: 'adeo_merch_second_ver_bu_label_string', rabbitMqField: 'ADEO_MerchSecondVer_BULabel_string', aclField: 'buLabel' },
      { apiField: 'adeo_merch_second_ver_projection_implantation_date_time', rabbitMqField: 'ADEO_MerchSecondVer_ProjectionImplantationDate_time', aclField: 'briefBUInhabitantAvailabilityDate' },
      { apiField: 'adeo_merch_second_ver_taking_back_former_stock_double', rabbitMqField: 'ADEO_MerchSecondVer_TakingBackFormerStock_double', aclField: 'briefBUTakingBackFormerRangeStock' },
      { apiField: 'adeo_merch_second_ver_rebate_former_range_double', rabbitMqField: 'ADEO_MerchSecondVer_RebateFormerRange_double', aclField: 'briefBURebateFormerRange' },
      { apiField: 'adeo_merch_second_ver_merch_implementation_double', rabbitMqField: 'ADEO_MerchSecondVer_MerchImplementation_double', aclField: 'briefBUMerchImplementation' },
      { apiField: 'adeo_merch_second_ver_implement_estimated_cost_ke_double', rabbitMqField: 'ADEO_MerchSecondVer_ImplementEstimatedCostKe_double', aclField: 'briefBUImplementationEstimatedCost' },
      { apiField: 'adeo_merch_second_ver_implementation_help_double', rabbitMqField: 'ADEO_MerchSecondVer_ImplementationHelp_double', aclField: 'briefBUImplementationFinancialHelp' },
      { apiField: 'adeo_merch_second_up_secondary_name_string', rabbitMqField: 'ADEO_MerchSecondVer_SecondaryName_string', aclField: 'BUName' },
      { apiField: 'adeo_merch_second_up_projection_sales_existing_perimeter_double', rabbitMqField: 'ADEO_MerchSecondUp_ProjectionSalesExistingPerimeter_double', aclField: 'briefBUTurnoverExistingParameter' },
      { apiField: 'adeo_merch_second_up_projection_project_sales_per_store_double', rabbitMqField: 'ADEO_MerchSecondUp_ProjectionProjectSalesPerStore_double', aclField: 'briefBUProjectSalesPerStore', converter: EntierConverter },
      { apiField: 'adeo_merch_second_up_projection_project_sales_double', rabbitMqField: 'ADEO_MerchSecondUp_ProjectionProjectSales_double', aclField: 'briefBUTurnoverProjectProjections' },
      { apiField: 'adeo_merch_second_up_projection_nb_references_int', rabbitMqField: 'ADEO_MerchSecondUp_ProjectionNbReferences_int', aclField: 'briefBUNumberOfMatrixID' },
      { apiField: 'adeo_merch_second_up_projection_nb_reference_i2_int', rabbitMqField: 'ADEO_MerchSecondUp_ProjectionNbReferenceI2_int', aclField: 'briefBUNumberOfMatrixIDI2' },
      { apiField: 'adeo_merch_second_up_projection_nb_reference_i1_int', rabbitMqField: 'ADEO_MerchSecondUp_ProjectionNbReferenceI1_int', aclField: 'briefBUNumberOfMatrixIDI1' },
      { apiField: 'adeo_merch_second_up_projection_market_share_project_double', rabbitMqField: 'ADEO_MerchSecondUp_BriefCurrentProjectMarketShareByFamilySales_double', aclField: 'briefBUMarketShareProjectFamilySalesRate', converter: PercentConverter },
      { apiField: 'adeo_merch_second_up_projection3_x_net_margin_double', rabbitMqField: 'ADEO_MerchSecondUp_Projection3xNetMargin_double', aclField: 'briefBUMarginRateEstimated3xNet', converter: PercentConverter },
      { apiField: 'adeo_merch_second_up_brief_purchase_gain_rate1_st_price_double', rabbitMqField: 'ADEO_MerchSecondUp_BriefPurchaseGainRate1stPrice_double', aclField: 'briefBUPurchasingGainFirstPrice', converter: PercentConverter },
      { apiField: 'adeo_merch_second_up_brief_purchase_gain_rate_double', rabbitMqField: 'ADEO_MerchSecondUp_BriefPurchaseGainRate_double', aclField: 'briefBUPurchasingGainFirstPriceRate', converter: PercentConverter },
      { apiField: 'adeo_merch_second_up_brief_purchase_gain_double', rabbitMqField: 'ADEO_MerchSecondUp_BriefPurchaseGain_double', aclField: 'briefBUPurchasingGain' },
      { apiField: 'adeo_merch_second_up_brief_purchase_amount_double', rabbitMqField: 'ADEO_MerchSecondUp_BriefPurchaseAmount_double', aclField: 'briefBUPurchasingAmount' },
      { apiField: 'adeo_merch_second_up_3_xnet_margin_new_products_brief_double', rabbitMqField: 'ADEO_MerchSecondUp_3xnetMarginNewProductsBrief_double', aclField: 'briefBU3xNetMarginNewProductsRate', converter: PercentConverter },
      { apiField: 'adeo_merch_second_up_3_xnet_margin_new_products_double', rabbitMqField: 'ADEO_MerchSecondUp_3xnetMarginNewProducts_double', aclField: 'briefBU3xNetMarginNewProductsValidatedRate', converter: PercentConverter },
      { apiField: 'adeo_merch_second_up_final_commitments_selling_to_ke_double', rabbitMqField: 'ADEO_MerchSecondUp_FinalCommitmentsSellingTOKe_double', aclField: 'briefBUSellingTurnoverFullYeatCommitments', converter: EntierConverter },
      { apiField: 'adeo_merch_second_up_validated_purchase_gain_rate_double', rabbitMqField: 'ADEO_MerchSecondUp_ValidatedPurchaseGainRate_double', aclField: 'briefBUPurchasingGainValidatedRate', converter: PercentConverter },
      { apiField: 'adeo_merch_second_up_validated_purchase_gain_double', rabbitMqField: 'ADEO_MerchSecondUp_ValidatedPurchaseGain_double', aclField: 'briefBUPurchasingGainValidated' },
      { apiField: 'adeo_merch_second_up_validated_purchase_amount_double', rabbitMqField: 'ADEO_MerchSecondUp_ValidatedPurchaseAmount_double', aclField: 'briefBUPurchasingAmountValidated' },
      { apiField: 'adeo_merch_second_up_nb_matrix_code_commitment_int', rabbitMqField: 'ADEO_MerchSecondUp_NbMatrixCodeCommitment_int', aclField: 'briefBUNumberOfMatrixIdCommitment' },
      { apiField: 'adeo_merch_second_up_commitment_nb_referencei2_int', rabbitMqField: 'ADEO_MerchSecondUp_CommitmentNbReferencei2_int', aclField: 'briefBUNumberOfMatrixIdI2Commitment' },
      { apiField: 'adeo_merch_second_up_commitment_nb_referencei1_int', rabbitMqField: 'ADEO_MerchSecondUp_CommitmentNbReferencei1_int', aclField: 'briefBUNumberOfMatrixIdI1Commitment' },
      { apiField: 'adeo_merch_second_down_number_of_shop_double', rabbitMqField: 'ADEO_MerchSecondDown_NumberOfShop_double', aclField: 'BriefBUNumberOfShops' },
      // business forecast conditions
      { apiField: 'adeo_merch_second_up_buid_enum', rabbitMqField: 'ADEO_MerchSecondVer_BUID_enum', aclField: 'buId', converter: buConverter },
      { apiField: 'adeo_merch_second_ver_comment_string', rabbitMqField: 'ADEO_MerchSecondVer_Comment_string', aclField: 'comment' },
      { apiField: 'adeo_merch_second_ver_current3_x_net_buy_price_store_double', rabbitMqField: 'ADEO_MerchSecondVer_Expected3xNetBuyPriceStores_double', aclField: 'expected3xNetBuyPriceStore', converter: Decimal2Converter },
      { apiField: 'adeo_merch_second_ver_expected_business_warranty_period_int', rabbitMqField: 'ADEO_MerchSecondVer_ExpectedBusinessWarrantyPeriod_int', aclField: 'expectedBusinessWarrantyPersio' },
      { apiField: 'adeo_merch_second_ver_expected_merchandising_enum', rabbitMqField: 'ADEO_MerchSecondVer_ExpectedMerchandising_enum', aclField: 'expectedMerchandising', converter: expectedMerchandisingConverter },
      { apiField: 'adeo_merch_second_ver_expected_moq_double', rabbitMqField: 'ADEO_MerchSecondVer_ExpectedMOQ_double', aclField: 'expectedMoq' },
      { apiField: 'adeo_merch_second_ver_expected_range_letter_enum', rabbitMqField: 'ADEO_MerchSecondVer_ExpectedRangeLetter_enum', aclField: 'expectedRangeLetter', converter: expectedRangeLetterConverter },
      { apiField: 'adeo_merch_second_ver_expected_sell_price_for_customer_double', rabbitMqField: 'ADEO_MerchSecondVer_ExpectedSellPriceForCustomer_double', aclField: 'expectedSellPriceForCustomer', converter: Decimal2Converter },
      { apiField: 'adeo_merch_second_ver_freeze_forecast_boolean', rabbitMqField: 'ADEO_MerchSecondVer_FreezeForecast_boolean', aclField: 'freezeForecast' },
      { apiField: 'adeo_expected_delivery_promise_online', rabbitMqField: 'ADEO_ExpectedDeliveryPromiseOnline', aclField: 'expectedDeveliveryPromiseOnline', converter: expectedDeliveryPromiseOnlineConverter },
      { apiField: 'adeo_expected_delivery_promise_physical', rabbitMqField: 'ADEO_ExpectedDeliveryPromisePhysical', aclField: 'expectedDeveliveryPromisePhysical', converter: expectedDeliveryPromisePhysicalConverter },
      { apiField: 'adeo_merch_second_ver_implementation_date_time', rabbitMqField: 'ADEO_MerchSecondaryVer_ExpectedImplementationDate_time', aclField: 'expectedImplementationDate' },
      { apiField: 'adeo_merch_second_up_expected_forcasted_selling_to_double', rabbitMqField: 'ADEO_MerchSecondUp_ExpectedForcastedSellingTO_double', aclField: 'expectedForcastedSellingTO', converter: Decimal2Converter },
      { apiField: 'adeo_merch_second_up_expected_annual_sellout_forecast_qtity_double', rabbitMqField: 'ADEO_MerchSecondUp_ExpectedAnnualSelloutForecastQtity_double', aclField: 'expectedAnnualSelloutForecastQtity' },
      // business historical conditions
      { apiField: 'adeo_merch_second_ver_current_new_product_enum', rabbitMqField: 'ADEO_MerchSecondVer_CurrentNewProduct_enum', aclField: 'currentNewProduction', converter: currentNewProductionConverter },
      { apiField: 'adeo_merch_second_ver_current_ref_bu_string ', rabbitMqField: 'ADEO_MerchSecondVer_CurrentRefBU_string', aclField: 'currentRefBU' },
      { apiField: 'adeo_merch_second_ver_gtin_string ', rabbitMqField: 'ADEO_MerchSecondVer_GTIN_string', aclField: 'gtin' },
      { apiField: 'adeo_merch_second_ver_gtin_secondary_string ', rabbitMqField: 'ADEO_MerchSecondVer_GTINSecondary_string', aclField: 'gtinSecondary' },
      // business commitment conditions
      { apiField: 'adeo_merch_second_ver_final_nb_sample_request_integer', rabbitMqField: 'ADEO_MerchSecondVer_FinalNbSampleRequest_integer', aclField: 'finalNbSampleRequest' },
      { apiField: 'adeo_merch_second_ver_final_nb_sample_request_show_room_int', rabbitMqField: 'ADEO_MerchSecondVer_FinalNbSampleRequestShowRoom_int', aclField: 'finalNbSampleRequestShowRoom' },
      { apiField: 'adeo_merch_second_ver_freeze_commitment_boolean', rabbitMqField: 'ADEO_MerchSecondVer_FreezeCommitment_boolean', aclField: 'freezeCommitment' },
      { apiField: 'adeo_merch_second_ver_gtin_final_string', rabbitMqField: 'ADEO_MerchSecondVer_GTINFinal_string', aclField: 'gtinFinal' },
      { apiField: 'adeo_merch_second_up_final_commitments_selling_to_double', rabbitMqField: 'ADEO_MerchSecondUp_FinalCommitmentsSellingTO_double', aclField: 'finalComitmentSellingTo', converter: Decimal2Converter },
      { apiField: 'adeo_merch_second_up_expected_annual_sellout_commitment_double', rabbitMqField: 'ADEO_MerchSecondUp_ExpectedAnnualSelloutCommitment_double', aclField: 'expectedAnnualSelloutComitment' },
      { apiField: 'adeo_merch_second_up_expected_first_implementation_qtity_double', rabbitMqField: 'ADEO_MerchSecondUp_ExpectedFirstImplementationQtity_double', aclField: 'expectedFirstImplementationQtity' }
    ]
  }
}
