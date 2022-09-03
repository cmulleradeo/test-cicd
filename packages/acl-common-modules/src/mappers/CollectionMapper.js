import BaseMapper from './BaseMapper'

import oneToFiveConverter from './converters/oneToFiveConverter'
import subDepartmentConverter from './converters/subDepartmentConverter'
import familyConverter from './converters/familyConverter'
import departmentConverter from './converters/departmentConverter'
import yesNoConverter from './converters/yesNoConverter'
import buConverter from './converters/buConverter'
import projectTypeConverter from './converters/projectTypeConverter'

const nbTenderRoundConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_NbTenderRound:010': return '1'
    case 'ADEO_NbTenderRound:020': return '2'
    case 'ADEO_NbTenderRound:030': return '3'
    case 'ADEO_NbTenderRound:040': return '4'
    case 'ADEO_NbTenderRound:050': return '5'
    default: return null
  }
}

const expectedIndusLevelConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_IndustralizationLevel:010': return '1'
    case 'ADEO_IndustralizationLevel:020': return '2'
    case 'ADEO_IndustralizationLevel:030': return '3'
    default: return null
  }
}

const expectedCbdLevelConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_CBDLevel:010': return '1'
    case 'ADEO_CBDLevel:020': return '2'
    case 'ADEO_CBDLevel:030': return '3'
    default: return null
  }
}

const userArrayConverter = (inputField) => {
  if (!inputField.length) {
    return null
  } else {
    return inputField[0]
  }
}

const category1Converter = (inputField) => {
  switch (inputField) {
    case 'ADEO_Market:M01':
      return 'Projects Markets'
    case 'ADEO_Market:M02':
      return 'Construction Flooring & Garden Markets'
    case 'ADEO_Market:M03':
      return 'Technical Markets'
    case 'ADEO_Market:M04':
      return 'Decorative Markets'
    default:
      return null
  }
}

const category2Converter = (inputField) => {
  switch (inputField) {
    case 'ADEO_Department:01':
      return '01 - CONSTRUCTION MATERIALS'
    case 'ADEO_Department:02':
      return '02 - WOOD'
    case 'ADEO_Department:03':
      return '03 - ELECTRICITY - PLUMBING'
    case 'ADEO_Department:04':
      return '04 - TOOLS'
    case 'ADEO_Department:05':
      return '05 - WOODEN FLOORS - CARPETS - FLOORING'
    case 'ADEO_Department:06':
      return '06 - TILING'
    case 'ADEO_Department:07':
      return '07 - BATHROOM'
    case 'ADEO_Department:08':
      return '08 - COMFORT'
    case 'ADEO_Department:09':
      return '09 - GARDEN'
    case 'ADEO_Department:10':
      return '10 - HARDWARE'
    case 'ADEO_Department:11':
      return '11 - PAINT - HOUSEHOLD PRODUCT'
    case 'ADEO_Department:12':
      return '12 - DECORATION'
    case 'ADEO_Department:13':
      return '13 - LIGHTING'
    case 'ADEO_Department:14':
      return '14 - STORAGE'
    case 'ADEO_Department:17':
      return '17 - KITCHEN'
    default:
      return null
  }
}

const projectScopeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_ProjectScope:International Project (inc. TOP 1000)':
      return 'International Project (inc. TOP 1000)'
    case 'ADEO_ProjectScope:International Project (not inc. TOP 1000)':
      return 'International Project (not inc. TOP 1000)'
    case 'ADEO_ProjectScope:Top1000 Standalone':
      return 'Top1000 Standalone'
    case 'ADEO_ProjectScope:Specific Mono BU':
      return 'Specific Mono BU'
    default:
      return null
  }
}

const projectQualificationConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_ProjectQualification:Commercial Action':
      return 'Commercial Action'
    case 'ADEO_ProjectQualification:Continuous Improvment':
      return 'Continuous Improvment'
    case 'ADEO_ProjectQualification:Range Creation':
      return 'Range Creation'
    case 'ADEO_ProjectQualification:Range Actualisation':
      return 'Range Actualisation'
    case 'ADEO_ProjectQualification:Seasonal':
      return 'Seasonal'
    case 'ADEO_ProjectQualification:Supplier change':
      return 'Supplier change'
    default:
      return null
  }
}

const projectStatusConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_ProjectStatus:0':
      return 'In Progress'
    case 'ADEO_ProjectStatus:1':
      return 'Implemented'
    case 'ADEO_ProjectStatus:2':
      return 'Cancelled'
    case 'ADEO_ProjectStatus:3':
      return 'Postponed'
    default:
      return null
  }
}

const projectMdhScopeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_RegionalScope:010':
      return 'International (PASQ)'
    case 'ADEO_RegionalScope:020':
      return 'Russia (Local)'
    case 'ADEO_RegionalScope:030':
      return 'Brazil (Local)'
    default:
      return null
  }
}

const category1Accessor = (source) => (rabbitMqMessage) => {
  return source?.find((element) => element.$id === rabbitMqMessage.category1)?.adeo_brand_market_enum
}

const category2Accessor = (source) => (rabbitMqMessage) => {
  return source?.find((element) => element.$id === rabbitMqMessage.category2)?.adeo_department_department_enum
}

const seasonAccessor = (source) => (rabbitMqMessage) => {
  return source?.find((element) => element.$id === rabbitMqMessage.parent_season)?.node_name
}

// keep the first of the table
const calendarConverter = (inputField) => {
  if (inputField.length > 0) {
    return inputField[0]
  }
  return null
}

export default class CollectionMapper extends BaseMapper {
  constructor (category1Source, category2Source, seasons) {
    super()
    this.mapping = [
      { apiField: '$id', aclField: 'id' },
      { apiField: 'adeo_collection_project_code_string', rabbitMqField: 'ADEO_Collection_ProjectCode_string', aclField: 'projectCode' },
      { apiField: 'adeo_collection_merch_collection_version_ref', rabbitMqField: 'ADEO_Collection_MerchCollectionVersion_ref', aclField: 'merchCollectionId' },
      { apiField: 'adeo_purchasing_to_for_tender', rabbitMqField: 'ADEO_PurchasingTOForTender', aclField: 'briefTurnoverForTender' },
      { apiField: 'adeo_purchasing_nb_tender_round', rabbitMqField: 'ADEO_PurchasingNbTenderRound', converter: nbTenderRoundConverter, aclField: 'briefNumberOfTenderRound' },
      { apiField: 'adeo_purchasing_nb_products_for_tender', rabbitMqField: 'ADEO_PurchasingNbProductsForTender', aclField: 'briefNumberOfProductsForTender' },
      { apiField: 'adeo_purchasing_expected_indus_level', rabbitMqField: 'ADEO_PurchasingExpectedIndusLevel', converter: expectedIndusLevelConverter, aclField: 'briefExpectedIndustrialLevel' },
      { apiField: 'adeo_purchasing_expected_cbd_level', rabbitMqField: 'ADEO_PurchasingExpectedCBDLevel', converter: expectedCbdLevelConverter, aclField: 'briefExpectedCostBreakdownLevel' },
      { apiField: 'adeo_collection_attr_value_creation_supply_chain_enum', rabbitMqField: 'ADEO_CollectionAttr_ValueCreationSupplyChain_enum', converter: oneToFiveConverter, aclField: 'briefSupplyChainValueCreation' },
      { apiField: 'adeo_collection_attr_value_creation_re_conception_enum', rabbitMqField: 'ADEO_CollectionAttr_ValueCreationReConception_enum', converter: oneToFiveConverter, aclField: 'briefConceptionValueCreation' },
      { apiField: 'adeo_collection_attr_value_creation_quality_enum', rabbitMqField: 'ADEO_CollectionAttr_ValueCreationQuality_enum', converter: oneToFiveConverter, aclField: 'briefQualityValueCreation' },
      { apiField: 'adeo_collection_attr_value_creation_purchasing_enum', rabbitMqField: 'ADEO_CollectionAttr_ValueCreationPurchasing_enum', converter: oneToFiveConverter, aclField: 'briefPurchasingValueCreation' },
      { apiField: 'adeo_collection_attr_value_creation_offer_enum', rabbitMqField: 'ADEO_CollectionAttr_ValueCreationOffer_enum', converter: oneToFiveConverter, aclField: 'briefOfferValueCreation' },
      { apiField: 'adeo_collection_attr_value_creation_commercialization_enum', rabbitMqField: 'ADEO_CollectionAttr_ValueCreationCommercialization_enum', converter: oneToFiveConverter, aclField: 'briefCommercializationValueCreation' },
      { apiField: 'adeo_collection_attr_sustainable_and_recycle_enum', rabbitMqField: 'ADEO_CollectionAttr_SustainableAndRecycle_enum', converter: oneToFiveConverter, aclField: 'briefMadeFromResponsibleProductionValueCreation' },
      { apiField: 'adeo_collection_attr_sustainable_enum', rabbitMqField: 'ADEO_CollectionAttr_Sustainable_enum', converter: oneToFiveConverter, aclField: 'briefBringSustainableFeaturesValueCreation' },
      { apiField: 'adeo_collection_attr_madeto_last_enum', rabbitMqField: 'ADEO_CollectionAttr_MadetoLast_enum', converter: oneToFiveConverter, aclField: 'briefMadeToLastValueCreation' },
      { apiField: 'adeo_collection_attr_responsible_prod_enum', rabbitMqField: 'ADEO_CollectionAttr_ResponsibleProd_enum', converter: oneToFiveConverter, aclField: 'briefMadeFromSustainableAndRecycledRessourcesValueCreation' },
      { apiField: 'adeo_collection_attr_safe_for_planet_enum', rabbitMqField: 'ADEO_CollectionAttr_SafeForPlanet_enum', converter: oneToFiveConverter, aclField: 'briefSafeForPlanetAndPeopleValueCreation' },
      { apiField: 'adeo_collection_attr_sub_department01_enum', rabbitMqField: 'ADEO_CollectionAttr_SubDepartment01_enum', converter: subDepartmentConverter, aclField: 'briefSubDepartment01' },
      { apiField: 'adeo_collection_attr_sub_department02_enum', rabbitMqField: 'ADEO_CollectionAttr_SubDepartment02_enum', converter: subDepartmentConverter, aclField: 'briefSubDepartment02' },
      { apiField: 'adeo_collection_attr_sub_department03_enum', rabbitMqField: 'ADEO_CollectionAttr_SubDepartment03_enum', converter: subDepartmentConverter, aclField: 'briefSubDepartment03' },
      { apiField: 'adeo_collection_attr_sub_department04_enum', rabbitMqField: 'ADEO_CollectionAttr_SubDepartment04_enum', converter: subDepartmentConverter, aclField: 'briefSubDepartment04' },
      { apiField: 'adeo_collection_attr_sub_department05_enum', rabbitMqField: 'ADEO_CollectionAttr_SubDepartment05_enum', converter: subDepartmentConverter, aclField: 'briefSubDepartment05' },
      { apiField: 'adeo_collection_attr_return_rate_current_double', rabbitMqField: 'ADEO_CollectionAttr_ReturnRateCurrent_double', aclField: 'briefCurrentReturnRate' },
      { apiField: 'adeo_collection_attr_return_rate_target_double', rabbitMqField: 'ADEO_CollectionAttr_ReturnRateTarget_double', aclField: 'briefTargetReturnRate' },
      { apiField: 'adeo_collection_attr_pitch_string', rabbitMqField: 'ADEO_CollectionAttr_Pitch_string', aclField: 'pitch' },
      { apiField: 'adeo_collection_attr_intellectual_property_bool', rabbitMqField: 'ADEO_CollectionAttr_IntellectualProperty_bool', aclField: 'intellectualProperty' },
      { apiField: 'adeo_collection_attr_family01_enum', rabbitMqField: 'ADEO_CollectionAttr_Family01_enum', converter: familyConverter, aclField: 'briefFamily01' },
      { apiField: 'adeo_collection_attr_family02_enum', rabbitMqField: 'ADEO_CollectionAttr_Family02_enum', converter: familyConverter, aclField: 'briefFamily02' },
      { apiField: 'adeo_collection_attr_family03_enum', rabbitMqField: 'ADEO_CollectionAttr_Family03_enum', converter: familyConverter, aclField: 'briefFamily03' },
      { apiField: 'adeo_collection_attr_family04_enum', rabbitMqField: 'ADEO_CollectionAttr_Family04_enum', converter: familyConverter, aclField: 'briefFamily04' },
      { apiField: 'adeo_collection_attr_family05_enum', rabbitMqField: 'ADEO_CollectionAttr_Family05_enum', converter: familyConverter, aclField: 'briefFamily05' },
      { apiField: 'adeo_collection_attr_factor_of_success_string', rabbitMqField: 'ADEO_CollectionAttr_FactorOfSuccess_string', aclField: 'keyFactorsOfSuccess' },
      { apiField: 'adeo_collection_attr_dev_type_selection_double', rabbitMqField: 'ADEO_CollectionAttr_DevTypeSelection_double', aclField: 'briefSelectionRate' },
      { apiField: 'adeo_collection_attr_dev_type_conception_double', rabbitMqField: 'ADEO_CollectionAttr_DevTypeConception_double', aclField: 'briefConceptionRate' },
      { apiField: 'adeo_collection_attr_dev_type_co_development_double', rabbitMqField: 'ADEO_CollectionAttr_DevTypeCoDevelopment_double', aclField: 'briefCoDevelopementRate' },
      { apiField: 'adeo_collection_attr_department01_enum', rabbitMqField: 'ADEO_CollectionAttr_Department01_enum', converter: departmentConverter, aclField: 'briefDepartment01' },
      { apiField: 'adeo_collection_attr_department02_enum', rabbitMqField: 'ADEO_CollectionAttr_Department02_enum', converter: departmentConverter, aclField: 'briefDepartment02' },
      { apiField: 'adeo_collection_attr_department03_enum', rabbitMqField: 'ADEO_CollectionAttr_Department03_enum', converter: departmentConverter, aclField: 'briefDepartment03' },
      { apiField: 'adeo_collection_attr_department04_enum', rabbitMqField: 'ADEO_CollectionAttr_Department04_enum', converter: departmentConverter, aclField: 'briefDepartment04' },
      { apiField: 'adeo_collection_attr_department05_enum', rabbitMqField: 'ADEO_CollectionAttr_Department05_enum', converter: departmentConverter, aclField: 'briefDepartment05' },
      { apiField: 'adeo_collection_attr_customer_feedback_target_double', rabbitMqField: 'ADEO_CollectionAttr_CustomerFeedbackTarget_double', aclField: 'briefTargetCustomerFeedback' },
      { apiField: 'adeo_collection_attr_customer_feedback_current_double', rabbitMqField: 'ADEO_CollectionAttr_CustomerFeedbackCurrent_double', aclField: 'briefCurrentCustomerFeedback' },
      { apiField: 'adeo_collection_attr_after_sales_service_target_enum', rabbitMqField: 'ADEO_CollectionAttr_AfterSalesServiceTarget_enum', converter: yesNoConverter, aclField: 'briefTargetAfterSalesService' },
      { apiField: 'adeo_collection_attr_after_sales_service_current_enum', rabbitMqField: 'ADEO_CollectionAttr_AfterSalesServiceCurrent_enum', converter: yesNoConverter, aclField: 'briefCurrentAfterSalesService' },
      { apiField: 'adeo_collection_attr_team_quality_pqm_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamQualityPQM_ref', converter: userArrayConverter, aclField: 'teamQualityPqmId' },
      { apiField: 'adeo_collection_attr_team_quality_continuous_improvement_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamQualityContinuousImprovement_ref', converter: userArrayConverter, aclField: 'teamQualityContinuousImprovementId' },
      { apiField: 'adeo_collection_attr_team_purchase_supply_sco_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamPurchaseSupplySCO_ref', converter: userArrayConverter, aclField: 'teamPurchaseSupplyScoId' },
      { apiField: 'adeo_collection_attr_team_purchase_supply_raf_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamPurchaseSupplyRAF_ref', converter: userArrayConverter, aclField: 'teamPurchaseSupplyRafId' },
      { apiField: 'adeo_collection_attr_team_purchase_supply_pl_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamPurchaseSupplyPL_ref', converter: userArrayConverter, aclField: 'teamPurchaseSupplyPlId' },
      { apiField: 'adeo_collection_attr_team_purchase_sourcing_manager_reflist', rabbitMqField: 'ADEO_CollectionAttr_TeamPurchaseSourcingManager_reflist', converter: userArrayConverter, aclField: 'teamPurchaseSourcingManagerId' },
      { apiField: 'adeo_collection_attr_team_purchase_industrialization_manager_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamPurchaseIndustrializationManager_ref', converter: userArrayConverter, aclField: 'teamPurchaseIndustrializationManagerId' },
      { apiField: 'adeo_collection_attr_team_product_rcp_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductRCP_ref', converter: userArrayConverter, aclField: 'teamProductRcpId' },
      { apiField: 'adeo_collection_attr_team_product_pcm_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductPCM_ref', converter: userArrayConverter, aclField: 'teamProductPcmId' },
      { apiField: 'adeo_collection_attr_team_product_notice_manager_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductNoticeManager_ref', converter: userArrayConverter, aclField: 'teamProductNoticeManagerId' },
      { apiField: 'adeo_collection_attr_team_product_ml_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductML_ref', aclField: 'teamProductMlId' },
      { apiField: 'adeo_collection_attr_team_product_lui_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductLUI_ref', converter: userArrayConverter, aclField: 'teamProductLuiId' },
      { apiField: 'adeo_collection_attr_team_product_dl_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductDL_ref', converter: userArrayConverter, aclField: 'teamProductDlId' },
      { apiField: 'adeo_collection_attr_team_product_cl_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductCL_ref', converter: userArrayConverter, aclField: 'teamProductClId' },
      { apiField: 'adeo_collection_attr_team_product_ccp_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductCCP_ref', converter: userArrayConverter, aclField: 'teamProductCcpId' },
      { apiField: 'adeo_collection_attr_team_product_business_serial_life_manager_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamProductBusinessSerialLifeManager_ref', converter: userArrayConverter, aclField: 'teamProductBusinessSerialLifeManagerId' },
      { apiField: 'adeo_collection_attr_team_industry_pack_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamIndustryPack_ref', converter: userArrayConverter, aclField: 'teamIndustryPackId' },
      { apiField: 'adeo_collection_attr_team_industry_industrial_drawer_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamIndustryIndustrialDrawer_ref', converter: userArrayConverter, aclField: 'teamIndustryIndustrialDrawerId' },
      { apiField: 'adeo_collection_attr_team_industry_industrial_buyer_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamIndustryIndustrialBuyer_ref', converter: userArrayConverter, aclField: 'teamIndustryIndustrialBuyerId' },
      { apiField: 'adeo_collection_attr_team_industry_il_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamIndustryIL_ref', converter: userArrayConverter, aclField: 'teamIndustryIlId' },
      { apiField: 'adeo_collection_attr_team_industry_design_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamIndustryDesign_ref', converter: userArrayConverter, aclField: 'teamIndustryDesignId' },
      { apiField: 'adeo_collection_attr_team_industry_conception_engineer_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamIndustryConceptionEngineer_ref', converter: userArrayConverter, aclField: 'teamIndustryConceptionEngineerId' },
      { apiField: 'adeo_collection_attr_team_bucp_leader_bu_enum', rabbitMqField: 'ADEO_CollectionAttr_TeamBUCPLeaderBU_enum', converter: buConverter, aclField: 'teamBuCpLeaderBu' },
      { apiField: 'adeo_collection_attr_team_bucp_leader_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamBUCPLeader_ref', aclField: 'teamBuCpLeaderId' },
      { apiField: 'adeo_collection_attr_team_bu_co_leader2_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamBUCoLeader2_ref', aclField: 'teamBuCoLeader2Id' },
      { apiField: 'adeo_collection_attr_team_bu_co_leader1_ref', rabbitMqField: 'ADEO_CollectionAttr_TeamBUCoLeader1_ref', aclField: 'teamBuCoLeader1Id' },
      { apiField: 'adeo_collection_attr_category_manager_cm_reflist', rabbitMqField: 'ADEO_CollectionAttr_CategoryManagerCM_reflist', converter: userArrayConverter, aclField: 'categoryManagerCmId' },
      { apiField: 'adeo_collection_attr_cp9_lmru_ref', rabbitMqField: 'ADEO_CollectionAttr_CP9LMRU_ref', aclField: 'CP9LmRuId' },
      { apiField: 'adeo_collection_attr_cp7_lmbr_ref', rabbitMqField: 'ADEO_CollectionAttr_CP7LMBR_ref', aclField: 'CP7LmBrId' },
      { apiField: 'adeo_collection_attr_cp6_lmpl_ref', rabbitMqField: 'ADEO_CollectionAttr_CP6LMPL_ref', aclField: 'CP6LmPlId' },
      { apiField: 'adeo_collection_attr_cp5_lmit_ref', rabbitMqField: 'ADEO_CollectionAttr_CP5LMIT_ref', aclField: 'CP5LmItId' },
      { apiField: 'adeo_collection_attr_cp53_lmza_ref', rabbitMqField: 'ADEO_CollectionAttr_CP53LMZA_ref', aclField: 'CP53LmZaId' },
      { apiField: 'adeo_collection_attr_cp3_lmpt_ref', rabbitMqField: 'ADEO_CollectionAttr_CP3LMPT_ref', aclField: 'CP3LmPtId' },
      { apiField: 'adeo_collection_attr_cp38_zodio_br_ref', rabbitMqField: 'ADEO_CollectionAttr_CP38ZodioBR_ref', aclField: 'CP38ZodioBrId' },
      { apiField: 'adeo_collection_attr_cp2_lmes_ref', rabbitMqField: 'ADEO_CollectionAttr_CP2LMES_ref', aclField: 'CP2LmEsId' },
      { apiField: 'adeo_collection_attr_cp26_lmro_ref', rabbitMqField: 'ADEO_CollectionAttr_CP26LMRO_ref', aclField: 'CP26LmRoId' },
      { apiField: 'adeo_collection_attr_cp23_lmua_ref', rabbitMqField: 'ADEO_CollectionAttr_CP23LMUA_ref', aclField: 'CP23LmUaId' },
      { apiField: 'adeo_collection_attr_cp22_bricoman_it_ref', rabbitMqField: 'ADEO_CollectionAttr_CP22BricomanIT_ref', aclField: 'CP22BricomanItId' },
      { apiField: 'adeo_collection_attr_cp21_zodio_fr_ref', rabbitMqField: 'ADEO_CollectionAttr_CP21ZodioFRSecondary_ref', aclField: 'CP21ZodioFrId' },
      { apiField: 'adeo_collection_attr_cp20_bricoman_pl_ref', rabbitMqField: 'ADEO_CollectionAttr_CP20BricomanPL_ref', aclField: 'CP20BricomanPlId' },
      { apiField: 'adeo_collection_attr_cp1_lmfr_ref', rabbitMqField: 'ADEO_CollectionAttr_CP1LMFR_ref', aclField: 'CP1LmFrId' },
      { apiField: 'adeo_collection_attr_cp19_lmgrcy_ref', rabbitMqField: 'ADEO_CollectionAttr_CP19LMGRCY_ref', aclField: 'CP19LmGrCyId' },
      { apiField: 'adeo_collection_attr_cp18_bricomart_ref', rabbitMqField: 'ADEO_CollectionAttr_CP18Bricomart_ref', aclField: 'CP18BricomartId' },
      { apiField: 'adeo_collection_attr_cp17_weldom_ser_ref', rabbitMqField: 'ADEO_CollectionAttr_CP17WeldomSer_ref', aclField: 'CP17WeldomSerId' },
      { apiField: 'adeo_collection_attr_cp14_bricoman_fr_ref', rabbitMqField: 'ADEO_CollectionAttr_CP14BricomanFR_ref', aclField: 'CP14BricomanFrId' },
      { apiField: 'adeo_collection_attr_cp10_bricocenter_ref', rabbitMqField: 'ADEO_CollectionAttr_CP10Bricocenter_ref', aclField: 'CP10BricoCenterId' },
      { apiField: 'adeo_collection_parent_season_code_string', accessor: seasonAccessor(seasons), aclField: 'ttm' },
      { apiField: 'adeo_collection_project_code_string', rabbitMqField: 'ADEO_Collection_ProjectCode_string', aclField: 'projectCode' },
      { apiField: 'adeo_collection_project_name_string', rabbitMqField: 'ADEO_Collection_ProjectName_string', aclField: 'projectName' },
      { apiField: 'adeo_collection_project_type_enum', rabbitMqField: 'ADEO_Collection_ProjectType_enum', aclField: 'projectType', converter: projectTypeConverter },
      { apiField: 'adeo_collection_project_status_enum', rabbitMqField: 'ADEO_Collection_ProjectStatus_enum', aclField: 'projectStatus', converter: projectStatusConverter },
      { apiField: 'adeo_collection_initial_project_code_string', rabbitMqField: 'ADEO_Collection_InitialProjectCode_string', aclField: 'projectInitialCode' },
      { apiField: 'category1', rabbitMqField: 'category1', aclField: 'category1Id' },
      { apiField: 'category1', accessor: category1Accessor(category1Source), aclField: 'category1Value', converter: category1Converter },
      { apiField: 'category2', rabbitMqField: 'category2', aclField: 'category2Id' },
      { apiField: 'category2', accessor: category2Accessor(category2Source), aclField: 'category2Value', converter: category2Converter },
      { apiField: 'adeo_department_department_enum', rabbitMqField: 'adeo_department_department_enum', aclField: 'category2Value', converter: category2Converter },
      { apiField: 'adeo_collection_attr_project_scope_enum', rabbitMqField: 'ADEO_CollectionAttr_ProjectScope_enum', aclField: 'projectScope', converter: projectScopeConverter },
      { apiField: 'adeo_collection_attr_project_qualification_enum', rabbitMqField: 'ADEO_CollectionAttr_ProjectQualification_enum', aclField: 'projectQualification', converter: projectQualificationConverter },
      { apiField: 'adeo_collection_attr_project_life_time_double', rabbitMqField: 'ADEO_CollectionAttr_ProjectLifeTime_double', aclField: 'projectLifeTime' },
      { apiField: 'adeo_collection_scope_enum', rabbitMqField: 'ADEO_Collection_Scope_enum', aclField: 'projectMdhScope', converter: projectMdhScopeConverter },
      { apiField: 'calendar', rabbitMqField: 'Calendar', aclField: 'calendar', converter: calendarConverter }
    ]
  }
}
