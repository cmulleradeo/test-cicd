import BaseMapper from './BaseMapper'
import familyConverter from './converters/familyConverter'
import departmentConverter from './converters/departmentConverter'
import subDepartmentConverter from './converters/subDepartmentConverter'
import yesNoConverter from './converters/yesNoConverter'
import salesUnitPackTypeConverter from './converters/salesUnitPackTypeConverter'
import projectTypeConverter from './converters/projectTypeConverter'

const rangeLevelConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_Level:Level 1': return 'Level 1'
    case 'ADEO_Level:Level 2': return 'Level 2'
    case 'ADEO_Level:Level 3': return 'Level 3'
    default: return null
  }
}

const internationalRangeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_Commonality:i1': return 'i1'
    case 'ADEO_Commonality:i2': return 'i2'
    case 'ADEO_Commonality:i3': return 'i3'
    case 'ADEO_Commonality:i4': return 'i4'
    default: return null
  }
}

const developmentModeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_DevelopmentType:Co-Development': return 'Co-Development'
    case 'ADEO_DevelopmentType:Conception': return 'Conception'
    case 'ADEO_DevelopmentType:Selection ': return 'Selection'
    default: return null
  }
}

const productStatusConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_ProductStatus:Cancelled': return 'Cancelled'
    case 'ADEO_ProductStatus:Confirmed': return 'Confirmed'
    case 'ADEO_ProductStatus:Deleted ': return 'Deleted'
    default: return null
  }
}

const unitOfContentConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_UnitOfContent:GM': return 'Gram'
    case 'ADEO_UnitOfContent:KGM': return 'Kilogram'
    case 'ADEO_UnitOfContent:LTR': return 'Litre'
    case 'ADEO_UnitOfContent:MTK': return 'Square Metre'
    case 'ADEO_UnitOfContent:MTQ': return 'Cubic Metre'
    case 'ADEO_UnitOfContent:MTR': return 'Metre'
    case 'ADEO_UnitOfContent:MTRL': return 'Linear Meter'
    case 'ADEO_UnitOfContent:PAL': return 'Palett'
    case 'ADEO_UnitOfContent:PCE': return 'Piece'
    default: return null
  }
}

const innerPackTypeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_InnerPackType:010': return 'Cardboard box'
    case 'ADEO_InnerPackType:020': return 'Display'
    case 'ADEO_InnerPackType:030': return 'Plastic bag'
    case 'ADEO_InnerPackType:040': return 'Shrink film'
    case 'ADEO_InnerPackType:050': return 'Plastic link'
    case 'ADEO_InnerPackType:060': return 'Paper bag'
    case 'ADEO_InnerPackType:070': return 'Paper link'
    case 'ADEO_InnerPackType:080': return 'Other'
    case 'ADEO_InnerPackType:090': return 'N/A'
    default: return null
  }
}

const masterDecliConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_MasterOrDecli:010': return 'Master'
    case 'ADEO_MasterOrDecli:020': return 'Decli'
    default: return null
  }
}

const masterPackConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_MasterPackType:010': return 'Cardboard box'
    case 'ADEO_MasterPackType:020': return 'Display'
    case 'ADEO_MasterPackType:030': return 'Plastic bag'
    case 'ADEO_MasterPackType:040': return 'Shrink film'
    case 'ADEO_MasterPackType:050': return 'Paper bag'
    case 'ADEO_MasterPackType:060': return 'Other'
    case 'ADEO_MasterPackType:070': return 'N/A'
    default: return null
  }
}

const packProdTypeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_PackProdType:010': return 'Agency'
    case 'ADEO_PackProdType:020': return 'Supplier'
    case 'ADEO_PackProdType:030': return 'Internal creation'
    case 'ADEO_PackProdType:040': return 'Agency : automatization'
    case 'ADEO_PackProdType:050': return 'Supplier : automatization'
    default: return null
  }
}

const packStatusConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_PackStatus:010': return 'Not received'
    case 'ADEO_PackStatus:020': return 'Waiting for validation'
    case 'ADEO_PackStatus:030': return 'Rejected'
    case 'ADEO_PackStatus:040': return 'Validated'
    default: return null
  }
}

const packWasteInfoConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_PackWasteInfo:010': return 'Nothing'
    case 'ADEO_PackWasteInfo:020': return 'Green dot only'
    case 'ADEO_PackWasteInfo:030': return 'Green dot + Triman'
    case 'ADEO_PackWasteInfo:040': return 'Case 1 : Cardboard only'
    case 'ADEO_PackWasteInfo:050': return 'Case 2A : Plastic Bag/Shrink component only'
    case 'ADEO_PackWasteInfo:060': return 'Case 2B : Plastic components'
    case 'ADEO_PackWasteInfo:070': return 'Case 3 : Cardboard + Plastic except PSE'
    case 'ADEO_PackWasteInfo:080': return 'Case 4 : Cardboard + Plastic + PSE'
    default: return null
  }
}

const palettTypeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_PalletType:010': return 'Wood pallet'
    case 'ADEO_PalletType:020': return 'Cardboard pallet'
    case 'ADEO_PalletType:030': return 'Steel pallet'
    case 'ADEO_PalletType:040': return 'Backrest pallet'
    case 'ADEO_PalletType:050': return 'Box pallet'
    case 'ADEO_PalletType:060': return 'Other'
    case 'ADEO_PalletType:070': return '-> N/A'
    default: return null
  }
}

const brandTypeConverter = (inputField) => {
  switch (inputField) {
    case 'ADEO_BrandType:MDH': return 'MDH'
    case 'ADEO_BrandType:National Brand': return 'National Brand'
    case 'ADEO_BrandType:No Name': return 'No Name'
    default: return null
  }
}

export default class StyleMapper extends BaseMapper {
  constructor () {
    super()
    this.mapping = [
      { apiField: '$id', rabbitMqField: 'id', aclField: 'id' },
      { apiField: 'adeo_style_matrix_id_functionnal_string', rabbitMqField: 'ADEO_Style_MatrixIDFunctionnal_string', aclField: 'matrixId' },
      { apiField: 'adeo_style_matrix_code_string', rabbitMqField: 'ADEO_Style_MatrixCode_string', aclField: 'matrixCode' },
      { apiField: 'adeo_style_revision_integer', rabbitMqField: 'ADEO_Style_Revision_integer', aclField: 'revision' },
      { apiField: 'adeo_style_short_product_designation_string', rabbitMqField: 'ADEO_Style_ShortProductDesignation_string', aclField: 'shortDesignation' },
      { apiField: 'adeo_style_family_enum', rabbitMqField: 'ADEO_Style_Family_enum', converter: familyConverter, aclField: 'family' },
      { apiField: 'adeo_style_sub_department_enum', rabbitMqField: 'ADEO_Style_SubDepartment_enum', converter: subDepartmentConverter, aclField: 'subDepartement' },
      { apiField: 'adeo_style_range_level_enum', rabbitMqField: 'ADEO_Style_RangeLevel_enum', converter: rangeLevelConverter, aclField: 'valueLevel' },
      { apiField: 'adeo_style_international_range_enum', rabbitMqField: 'ADEO_Style_InternationalRange_enum', converter: internationalRangeConverter, aclField: 'internationalRange' },
      { apiField: 'adeo_development_mode_enum', rabbitMqField: 'ADEO_DevelopmentMode_enum', converter: developmentModeConverter, aclField: 'developmentMode' },
      { apiField: 'adeo_style_product_status_enum', rabbitMqField: 'ADEO_Style_ProductStatus_enum', converter: productStatusConverter, aclField: 'productStatus' },
      { apiField: 'adeo_amount_of_content', rabbitMqField: 'ADEO_AmountOfContent', aclField: 'amountOfContent' },
      { apiField: 'adeo_unit_of_content', rabbitMqField: 'ADEO_UnitOfContent', converter: unitOfContentConverter, aclField: 'unitOfContent' },
      { apiField: 'adeo_style_department_enum', rabbitMqField: 'ADEO_Style_Department_enum', converter: departmentConverter, aclField: 'department' },
      { apiField: 'adeo_style_first_price_enum', rabbitMqField: 'ADEO_Style_FirstPrice_enum', converter: yesNoConverter, aclField: 'firstPrice' },
      { apiField: 'adeo_style_line_number_integer', rabbitMqField: 'ADEO_Style_LineNumber_integer', aclField: 'lineNumber' },
      { apiField: 'adeo_style_new_product_boolean', rabbitMqField: 'ADEO_Style_NewProduct_boolean', aclField: 'newProduct' },
      { apiField: 'adeo_style_poster_only_boolean', rabbitMqField: 'ADEO_Style_PosterOnly_boolean', aclField: 'posterOnly' },
      { apiField: 'adeo_style_product_designation_string', rabbitMqField: 'ADEO_Style_ProductDesignation_string', aclField: 'longDesignation' },
      { apiField: 'adeo_style_product_type_string', rabbitMqField: 'ADEO_Style_ProductType_string', aclField: 'productType' },
      { apiField: 'adeo_style_project_initial_code_string', rabbitMqField: 'ADEO_Style_ProjectInitialCode_string', aclField: 'projectInitialCode' },
      { apiField: 'adeo_style_project_type_enum', rabbitMqField: 'ADEO_Style_ProjectType_enum', converter: projectTypeConverter, aclField: 'projectType' },
      { apiField: 'adeo_style_top1000_enum', rabbitMqField: 'ADEO_Style_Top1000_enum', converter: yesNoConverter, aclField: 'top1000' },
      { apiField: 'adeo_style_top_sample_enum', rabbitMqField: 'ADEO_Style_TopSample_enum', converter: yesNoConverter, aclField: 'topSample' },
      { apiField: 'adeo_style_attr_address_for_artwork_string', rabbitMqField: 'ADEO_StyleAttr_AddressForArtwork_string', aclField: 'addressForArtwork' },
      { apiField: 'adeo_style_attr_artwork_language_string', rabbitMqField: 'ADEO_StyleAttr_ArtworkLanguage_string', aclField: 'artworkLanguage' },
      { apiField: 'adeo_style_attr_call_for_tender_boolean', rabbitMqField: 'ADEO_StyleAttr_CallForTender_Boolean', aclField: 'callForTender' },
      { apiField: 'adeo_style_attr_compatible_with_string', rabbitMqField: 'ADEO_StyleAttr_CompatibleWith_String', aclField: 'compatibleWith' },
      { apiField: 'adeo_style_attr_deadline_string', rabbitMqField: 'ADEO_StyleAttr_Deadline_string', aclField: 'deadline' },
      { apiField: 'adeo_style_attr_expected_moq_double', rabbitMqField: 'ADEO_StyleAttr_ExpectedMOQ_double', aclField: 'expectedMoq' },
      { apiField: 'adeo_style_attr_fifth_advantage_product_string', rabbitMqField: 'ADEO_StyleAttr_FifthAdvantageProduct_string', aclField: 'fifthAdvantageProduct' },
      { apiField: 'adeo_style_attr_fourth_advantage_product_string', rabbitMqField: 'ADEO_StyleAttr_FourthAdvantageProduct_string', aclField: 'fourthAdvantageProduct' },
      { apiField: 'adeo_style_attr_function1_string', rabbitMqField: 'ADEO_StyleAttr_Function1_String', aclField: 'function1' },
      { apiField: 'adeo_style_attr_function2_string', rabbitMqField: 'ADEO_StyleAttr_Function2_String', aclField: 'function2' },
      { apiField: 'adeo_style_attr_function3_string', rabbitMqField: 'ADEO_StyleAttr_Function3_String', aclField: 'function3' },
      { apiField: 'adeo_style_attr_function4_string', rabbitMqField: 'ADEO_StyleAttr_Function4_String', aclField: 'function4' },
      { apiField: 'adeo_style_attr_golden_samples_comments_string', rabbitMqField: 'ADEO_StyleAttr_GoldenSamplesComments_String', aclField: 'goldenSamplesComments' },
      { apiField: 'adeo_style_attr_golden_samples_validation_string', rabbitMqField: 'ADEO_StyleAttr_GoldenSamplesValidation_String', aclField: 'goldenSamplesValidation' },
      { apiField: 'adeo_style_attr_hookable_pack_enum', rabbitMqField: 'ADEO_StyleAttr_HookablePack_enum', converter: yesNoConverter, aclField: 'hookablePack' },
      { apiField: 'adeo_style_attr_ideal_use_of_product_string', rabbitMqField: 'ADEO_StyleAttr_IdealUseOfProduct_string', aclField: 'idealUseOfProduct' },
      { apiField: 'adeo_style_attr_inner_pack_type_enum', rabbitMqField: 'ADEO_StyleAttr_InnerPackType_enum', converter: innerPackTypeConverter, aclField: 'innerPackType' },
      { apiField: 'adeo_style_attr_instruction_manual_bool', rabbitMqField: 'ADEO_StyleAttr_InstructionManual_bool', aclField: 'instructionManual' },
      { apiField: 'adeo_style_attr_instruction_manual_string', rabbitMqField: 'ADEO_StyleAttr_InstructionManual_string', aclField: 'instructionManualOnArtwork' },
      { apiField: 'adeo_style_attr_instruction_manual_name_string', rabbitMqField: 'ADEO_StyleAttr_InstructionManualName_string', aclField: 'instructionManualName' },
      { apiField: 'adeo_style_attr_intellectual_property_bool', rabbitMqField: 'ADEO_StyleAttr_IntellectualProperty_bool', aclField: 'intellectualProperty' },
      { apiField: 'adeo_style_attr_legal_warranty_duration_bool', rabbitMqField: 'ADEO_StyleAttr_LegalWarrantyDuration_bool', aclField: 'legalWarrantyDuration' },
      { apiField: 'adeo_style_attr_made_in_en_string', rabbitMqField: 'ADEO_StyleAttr_MadeInEN_string', aclField: 'madeInEn' },
      { apiField: 'adeo_style_attr_main_advantage_of_product_string', rabbitMqField: 'ADEO_StyleAttr_MainAdvantageOfProduct_string', aclField: 'mainAdvantageOfProduct' },
      { apiField: 'adeo_style_attr_master_decli_enum', rabbitMqField: 'ADEO_StyleAttr_MasterDecli_enum', converter: masterDecliConverter, aclField: 'masterDecli' },
      { apiField: 'adeo_style_attr_master_pack_type_enum', rabbitMqField: 'ADEO_StyleAttr_MasterPackType_enum', converter: masterPackConverter, aclField: 'masterPackType' },
      { apiField: 'adeo_style_attr_mdh_warranty_duration_double', rabbitMqField: 'ADEO_StyleAttr_RUMDHWarrantyDuration_double', aclField: 'mdhWarrantyDuration' },
      { apiField: 'adeo_style_attr_mop_double', rabbitMqField: 'ADEO_StyleAttr_MOP_double', aclField: 'mop' },
      { apiField: 'adeo_style_attr_name_of_the_product_serie_string', rabbitMqField: 'ADEO_StyleAttr_NameOfTheProductSerie_string', aclField: 'nameOfTheProductSerie' },
      { apiField: 'adeo_style_attr_name_of_videos_string', rabbitMqField: 'ADEO_StyleAttr_NameOfVideos_string', aclField: 'nameOfVideos' },
      { apiField: 'adeo_style_attr_nb_of_printed_color_string', rabbitMqField: 'ADEO_StyleAttr_NbOfPrintedColor_string', aclField: 'nbPrintedColors' },
      { apiField: 'adeo_style_attr_nb_product_sold_unit_pack_double', rabbitMqField: 'ADEO_StyleAttr_NbProductSoldUnitPack_double', aclField: 'nbProductSoldUnitPack' },
      { apiField: 'adeo_style_attr_new_gtin_reason_string', rabbitMqField: 'ADEO_StyleAttr_NewGTINReason_String', aclField: 'newGtinReason' },
      { apiField: 'adeo_style_attr_new_gtin_required_string', rabbitMqField: 'ADEO_StyleAttr_NewGTINRequired_String', aclField: 'newGtinRequired' },
      { apiField: 'adeo_style_attr_notice_language_string', rabbitMqField: 'ADEO_StyleAttr_NoticeLanguage_string', aclField: 'noticeLanguage' },
      { apiField: 'adeo_style_attr_golden_samples_comments_string', rabbitMqField: 'ADEO_StyleAttr_GoldenSamplesComments_String', aclField: 'numSampleRequestCommunication' },
      { apiField: 'adeo_style_attr_num_sample_request_golden_sample_double', rabbitMqField: 'ADEO_StyleAttr_NumSampleRequestGoldenSample_double', aclField: 'numSampleRequestGoldenSample' },
      { apiField: 'adeo_style_attr_num_sample_request_silver_sample_double', rabbitMqField: 'ADEO_StyleAttr_NumSampleRequestSilverSample_double', aclField: 'numSampleRequestSilverSample' },
      { apiField: 'adeo_style_attr_num_sample_request_workshop_double', rabbitMqField: 'ADEO_StyleAttr_NumSampleRequestWorkshop_double', aclField: 'numSampleRequestWorkshop' },
      { apiField: 'adeo_style_attr_pack_prod_type_enum', rabbitMqField: 'ADEO_StyleAttr_PackProdType_enum', converter: packProdTypeConverter, aclField: 'packProdType' },
      { apiField: 'adeo_style_attr_pack_status_enum', rabbitMqField: 'ADEO_StyleAttr_PackStatus_enum', converter: packStatusConverter, aclField: 'packStatus' },
      { apiField: 'adeo_style_attr_pack_waste_info_enum', rabbitMqField: 'ADEO_StyleAttr_PackWasteInfo_enum', converter: packWasteInfoConverter, aclField: 'packWasteInfo' },
      { apiField: 'adeo_style_attr_palette_pcb_expected_double', rabbitMqField: 'ADEO_StyleAttr_PalettePCBExpected_double', aclField: 'palettePcbExpected' },
      { apiField: 'adeo_style_attr_pallet_type_enum', rabbitMqField: 'ADEO_StyleAttr_PalletType_enum', converter: palettTypeConverter, aclField: 'paletteType' },
      { apiField: 'adeo_style_attr_parcel_weight_double', rabbitMqField: 'ADEO_StyleAttr_ParcelWeight_double', aclField: 'parcelWeight' },
      { apiField: 'adeo_style_attr_photo_video_sample_string', rabbitMqField: 'ADEO_StyleAttr_PhotoVideoSample_string', aclField: 'photoVideoSample' },
      { apiField: 'adeo_style_attr_pic_illus_for_pack1_string', rabbitMqField: 'ADEO_StyleAttr_PicIllusForPack1_string', aclField: 'picIlluseForPack1' },
      { apiField: 'adeo_style_attr_pic_illus_for_pack2_string', rabbitMqField: 'ADEO_StyleAttr_PicIllusForPack2_string', aclField: 'picIlluseForPack2' },
      { apiField: 'adeo_style_attr_printing_process_string', rabbitMqField: 'ADEO_StyleAttr_PrintingProcess_string', aclField: 'printingProcess' },
      { apiField: 'adeo_style_attr_print_pack_component_string', rabbitMqField: 'ADEO_StyleAttr_PrintPackComponent_string', aclField: 'printPackComponent' },
      { apiField: 'adeo_style_attr_prod_designation_on_pack_string', rabbitMqField: 'ADEO_StyleAttr_ProdDesignationOnPack_string', aclField: 'longDesignationOnPack' },
      { apiField: 'adeo_style_attr_product_creation_modification_string', rabbitMqField: 'ADEO_StyleAttr_ProductCreationModification_String', aclField: 'productCreationModification' },
      { apiField: 'adeo_style_attr_product_modification_desc_string', rabbitMqField: 'ADEO_StyleAttr_ProductModificationDesc_String', aclField: 'productModificationDesc' },
      { apiField: 'adeo_style_attr_promotion_string', rabbitMqField: 'ADEO_StyleAttr_Promotion_string', aclField: 'promotion' },
      { apiField: 'adeo_style_attr_purchase_inner_expected_string', rabbitMqField: 'ADEO_StyleAttr_PurchaseInnerExpected_string', aclField: 'purchaseInnerExpected' },
      { apiField: 'adeo_style_attr_purchase_master_expected_string', rabbitMqField: 'ADEO_StyleAttr_PurchaseMasterExpected_string', aclField: 'purchaseMasterExpected' },
      { apiField: 'adeo_style_attr_purchase_merchandising_expected_string', rabbitMqField: 'ADEO_StyleAttr_PurchaseMerchandisingExpected_string', aclField: 'purchaseMerchandisingExpected' },
      { apiField: 'adeo_style_attr_qtity_of_address_artwork_integer', rabbitMqField: 'ADEO_StyleAttr_QtityOfAddressArtwork_integer', aclField: 'qtityAddressesArtwork' },
      { apiField: 'adeo_style_attr_qtity_picture_planned_integer', rabbitMqField: 'ADEO_StyleAttr_QtityPicturePlanned_integer', aclField: 'qtityPicturePlanned' },
      { apiField: 'adeo_style_attr_qtity_video_planned_integer', rabbitMqField: 'ADEO_StyleAttr_QtityVideoPlanned_integer', aclField: 'qtityVideoPlanned' },
      { apiField: 'adeo_style_attr_sales_unit_pack_type_enum', rabbitMqField: 'ADEO_StyleAttr_SalesUnitPackType_enum', converter: salesUnitPackTypeConverter, aclField: 'salesUnitPackType' },
      { apiField: 'adeo_style_attr_secondary_advantage_product_string', rabbitMqField: 'ADEO_StyleAttr_SecondaryAdvantageProduct_string', aclField: 'secondaryAdvantageProduct' },
      { apiField: 'adeo_style_attr_segmentation_string', rabbitMqField: 'ADEO_StyleAttr_Segmentation_string', aclField: 'segmentation' },
      { apiField: 'adeo_style_attr_silver_samples_validation_string', rabbitMqField: 'ADEO_StyleAttr_SilverSamplesValidation_String', aclField: 'silverSampleValidation' },
      { apiField: 'adeo_style_attr_silver_samples_validation_comments_string', rabbitMqField: 'ADEO_StyleAttr_SilverSamplesValidationComments_String', aclField: 'silverSampleValidationComments' },
      { apiField: 'adeo_style_attr_spare_parts_required_string', rabbitMqField: 'ADEO_StyleAttr_SparePartsRequired_String', aclField: 'sparePartsRequired' },
      { apiField: 'adeo_style_attr_technical_code_string', rabbitMqField: 'ADEO_StyleAttr_TechnicalCode_string', aclField: 'technicalCode' },
      { apiField: 'adeo_style_attr_technology_string', rabbitMqField: 'ADEO_StyleAttr_Technology_String', aclField: 'technology' },
      { apiField: 'adeo_style_attr_third_advantage_product_string', rabbitMqField: 'ADEO_StyleAttr_ThirdAdvantageProduct_string', aclField: 'thirdAdvantageProduct' },
      { apiField: 'adeo_style_brand_type_enum', rabbitMqField: 'ADEO_Style_BrandType_enum', converter: brandTypeConverter, aclField: 'brandType' },
      { apiField: '$parent', rabbitMqField: 'ADEO_Style_ParentGroup_ref', aclField: 'parentGroupId' },
      { apiField: 'adeo_style_datasheet_model_ref', rabbitMqField: 'ADEO_Style_DatasheetModel_ref', aclField: 'specDataSheetId' },
      { apiField: 'adeo_style_segment_ref', rabbitMqField: 'ADEO_Style_Segment_ref', aclField: 'segmentId' },
      { apiField: 'adeo_style_usage_ref', rabbitMqField: 'ADEO_Style_Usage_ref', aclField: 'usageId' },
      { apiField: 'adeo_style_style_ref', rabbitMqField: 'ADEO_Style_Style_ref', aclField: 'styleId' },
      { apiField: 'adeo_style_project_name_string', rabbitMqField: 'ADEO_Style_ProjectName_string', aclField: 'projectName' },
      // business conditions
      { apiField: 'style_mpv', rabbitMqField: 'StyleMPV', aclField: 'merchProductVersionId' }
    ]
  }
}
