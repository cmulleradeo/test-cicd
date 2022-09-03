import ClassifierModel from './ClassifierModel'
import CollectionModel from './CollectionModel'
import CollectionSpecSectionModel from './CollectionSpecSectionModel'
import MerchCollectionVersionModel from './MerchCollectionVersionModel'
import MerchSecondaryPlanModel from './MerchSecondaryPlanModel'
import MerchSecondaryVersionModel from './MerchSecondaryVersionModel'
import ProductSymbolModel from './ProductSymbolModel'
import SpecDataSheetModel from './SpecDataSheetModel'
import SpecDataSheetRevisionModel from './SpecDataSheetRevisionModel'
import SpecDataSheetRevisionItemModel from './SpecDataSheetRevisionItemModel'
import SpecDataSheetItemModel from './SpecDataSheetItemModel'
import SpecItemDefinitionModel from './SpecItemDefinitionModel'
import SpecSectionModel from './SpecSectionModel'
import SpecSectionItemModel from './SpecSectionItemModel'
import StyleBrandModel from './StyleBrandModel'
import StyleModel from './StyleModel'
import UserModel from './UserModel'
import MerchCollectionVersionSecondariesModel from './MerchCollectionVersionSecondariesModel'
import ActivityModel from './ActivityModel'
import MerchProductVersionSecondariesModel from './MerchProductVersionSecondariesModel'
import CalendarActivitiesModel from './CalendarActivitiesModel'
import RoleModel from './RoleModel'
import LookUpItemsModel from './LookUpItemsModel'

const dropSqlConstraintsAndIndexes = async (client) => {
  const sqlString =
  'DO $$' +
  'BEGIN' +
  '  IF (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = \'public\' AND table_name = \'Collection\')) THEN' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamQualityPqmId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamQualityContinuousImprovementId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamPurchaseSupplyScoId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamPurchaseSupplyRafId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamPurchaseSupplyPlId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamPurchaseSourcingManagerId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamPurchaseIndustrializationManagerId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamProductPcmId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamProductNoticeManagerId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamProductMlId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamProductLuiId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamProductClId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamProductCcpId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamProductBusinessSerialLifeManagerId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamIndustryPackId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamIndustryIndustrialDrawerId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamIndustryIndustrialBuyerId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamIndustryIlId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamIndustryDesignId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamIndustryConceptionEngineerId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamBuCpLeaderId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamBuCoLeader2Id_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_teamBuCoLeader1Id_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_categoryManagerCmId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP9LmRuId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP7LmBrId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP6LmPlId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP5LmItId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP53LmZaId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP3LmPtId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP38ZodioBrId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP2LmEsId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP26LmRoId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP23LmUaId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP22BricomanItId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP21ZodioFrId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP20BricomanPlId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP1LmFrId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP19LmGrCyId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP18BricomartId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP17WeldomSerId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP14BricomanFrId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_CP10BricoCenterId_fkey" ;' +
  '    ALTER TABLE public."Collection"  DROP CONSTRAINT IF EXISTS  "Collection_merchCollectionId_fkey" ;' +
  '    ALTER TABLE public."CollectionSpecSection" DROP CONSTRAINT IF EXISTS "CollectionSpecSection_collectionId_fkey";' +
  '    DROP INDEX IF EXISTS "Collection_ttm_idx";' +
  '    DROP INDEX IF EXISTS "Collection_projectCode_idx";' +
  '  END IF;' +
  '  ' +
  '  IF (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = \'public\' AND table_name = \'Style\')) THEN' +
  '    ALTER TABLE public."StyleBrand" DROP CONSTRAINT IF EXISTS "StyleBrand_styleId_fkey";' +
  '    ALTER TABLE public."StyleBrand" DROP CONSTRAINT IF EXISTS "StyleBrand_productSymbolId_fkey";' +
  '    ALTER TABLE public."Style" DROP CONSTRAINT IF EXISTS "Style_specDataSheetId_fkey";' +
  '    ALTER TABLE public."Style" DROP CONSTRAINT IF EXISTS "Style_segmentId_fkey";' +
  '    ALTER TABLE public."Style" DROP CONSTRAINT IF EXISTS "Style_styleId_fkey";' +
  '    ALTER TABLE public."Style" DROP CONSTRAINT IF EXISTS "Style_usageId_fkey";' +
  '    DROP INDEX IF EXISTS "Style_matrixId_idx";' +
  '  END IF;' +
  '  ' +
  '  IF (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = \'public\' AND table_name = \'SpecDataSheet\')) THEN' +
  '    ALTER TABLE public."SpecDataSheet" DROP CONSTRAINT IF EXISTS "SpecDataSheet_currentRevisionId_fkey";' +
  '    ALTER TABLE public."SpecDataSheetRevision" DROP CONSTRAINT IF EXISTS "SpecDataSheetRevision_specificationSectionId_fkey";' +
  '    ALTER TABLE public."SpecDataSheetRevisionItem" DROP CONSTRAINT IF EXISTS "SpecDataSheetRevisionItem_specDataSheetRevisionId_fkey";' +
  '    ALTER TABLE public."SpecDataSheetRevisionItem" DROP CONSTRAINT IF EXISTS "SpecDataSheetRevisionItem_specDataSheetItemId_fkey";' +
  '    ALTER TABLE public."SpecDataSheetItem" DROP CONSTRAINT IF EXISTS "SpecDataSheetItem_specificationSectionItemId_fkey";' +
  '    ALTER TABLE public."SpecSectionItem" DROP CONSTRAINT IF EXISTS "SpecSectionItem_specificationItemDefinitionId_fkey";' +
  '    ALTER TABLE public."CollectionSpecSection" DROP CONSTRAINT IF EXISTS "CollectionSpecSection_specSectionId_fkey";' +
  '  END IF;' +
  '  ' +
  '  IF (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = \'public\' AND table_name = \'MerchSecondaryVersion\')) THEN' +
  '    ALTER TABLE public."MerchCollectionVersionSecondaries"  DROP CONSTRAINT IF EXISTS  "MerchCollectionVersionSecondaries_merchCollectionVersionId_fkey" ;' +
  '    ALTER TABLE public."MerchCollectionVersionSecondaries"  DROP CONSTRAINT IF EXISTS  "MerchCollectionVersionSecondaries_merchSecondaryVersionId_fkey" ;' +
  '    ALTER TABLE public."MerchSecondaryVersion"  DROP CONSTRAINT IF EXISTS  "MerchSecondaryVersion_merchSecondaryPlanId_fkey" ;' +
  '    DROP INDEX IF EXISTS "MerchSecondaryVersion_buLabel_idx";' +
  '  END IF;' +
  '  ' +
  '  IF (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = \'public\' AND table_name = \'Activity\')) THEN' +
  '    ALTER TABLE public."Activity"  DROP CONSTRAINT IF EXISTS  "Activity_accountableUserId_fkey" ;' +
  '  END IF;' +
  'END $$'

  try {
    await client.query(sqlString)
  } catch (err) {
    throw new Error(`Failed to drop the database contraints: ${err}`)
  }
}

const createSqlConstraintsAndIndexes = async (client) => {
  await dropSqlConstraintsAndIndexes(client)

  const sqlString =
    'ALTER TABLE public."StyleBrand" ADD CONSTRAINT "StyleBrand_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES public."Style"(id);' +
    'ALTER TABLE public."StyleBrand" ADD CONSTRAINT "StyleBrand_productSymbolId_fkey" FOREIGN KEY ("productSymbolId") REFERENCES public."ProductSymbol"(id);' +
    'ALTER TABLE public."Style" ADD CONSTRAINT "Style_specDataSheetId_fkey" FOREIGN KEY ("specDataSheetId") REFERENCES public."SpecDataSheet"(id);' +
    'ALTER TABLE public."Style" ADD CONSTRAINT "Style_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES public."Classifier"(id);' +
    'ALTER TABLE public."Style" ADD CONSTRAINT "Style_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES public."Classifier"(id);' +
    'ALTER TABLE public."Style" ADD CONSTRAINT "Style_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES public."Classifier"(id);' +
    'ALTER TABLE public."SpecDataSheet" ADD CONSTRAINT "SpecDataSheet_currentRevisionId_fkey" FOREIGN KEY ("currentRevisionId") REFERENCES public."SpecDataSheetRevision"(id);' +
    'ALTER TABLE public."SpecDataSheetRevision" ADD CONSTRAINT "SpecDataSheetRevision_specificationSectionId_fkey" FOREIGN KEY ("specificationSectionId") REFERENCES public."SpecSection"(id);' +
    'ALTER TABLE public."SpecDataSheetRevisionItem" ADD CONSTRAINT "SpecDataSheetRevisionItem_specDataSheetRevisionId_fkey" FOREIGN KEY ("specDataSheetRevisionId") REFERENCES public."SpecDataSheetRevision"(id);' +
    'ALTER TABLE public."SpecDataSheetRevisionItem" ADD CONSTRAINT "SpecDataSheetRevisionItem_specDataSheetItemId_fkey" FOREIGN KEY ("specDataSheetItemId") REFERENCES public."SpecDataSheetItem"(id);' +
    'ALTER TABLE public."SpecDataSheetItem" ADD CONSTRAINT "SpecDataSheetItem_specificationSectionItemId_fkey" FOREIGN KEY ("specificationSectionItemId") REFERENCES public."SpecSectionItem"(id);' +
    'ALTER TABLE public."SpecSectionItem" ADD CONSTRAINT "SpecSectionItem_specificationItemDefinitionId_fkey" FOREIGN KEY ("specificationItemDefinitionId") REFERENCES public."SpecItemDefinition"(id);' +
    'ALTER TABLE public."CollectionSpecSection" ADD CONSTRAINT "CollectionSpecSection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collection"(id);' +
    'ALTER TABLE public."CollectionSpecSection" ADD CONSTRAINT "CollectionSpecSection_specSectionId_fkey" FOREIGN KEY ("specSectionId") REFERENCES public."SpecSection"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamQualityPqmId_fkey" FOREIGN KEY ("teamQualityPqmId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamQualityContinuousImprovementId_fkey" FOREIGN KEY ("teamQualityContinuousImprovementId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamPurchaseSupplyScoId_fkey" FOREIGN KEY ("teamPurchaseSupplyScoId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamPurchaseSupplyRafId_fkey" FOREIGN KEY ("teamPurchaseSupplyRafId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamPurchaseSupplyPlId_fkey" FOREIGN KEY ("teamPurchaseSupplyPlId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamPurchaseSourcingManagerId_fkey" FOREIGN KEY ("teamPurchaseSourcingManagerId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamPurchaseIndustrializationManagerId_fkey" FOREIGN KEY ("teamPurchaseIndustrializationManagerId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamProductPcmId_fkey" FOREIGN KEY ("teamProductPcmId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamProductNoticeManagerId_fkey" FOREIGN KEY ("teamProductNoticeManagerId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamProductMlId_fkey" FOREIGN KEY ("teamProductMlId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamProductLuiId_fkey" FOREIGN KEY ("teamProductLuiId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamProductClId_fkey" FOREIGN KEY ("teamProductClId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamProductCcpId_fkey" FOREIGN KEY ("teamProductCcpId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamProductBusinessSerialLifeManagerId_fkey" FOREIGN KEY ("teamProductBusinessSerialLifeManagerId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamIndustryPackId_fkey" FOREIGN KEY ("teamIndustryPackId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamIndustryIndustrialDrawerId_fkey" FOREIGN KEY ("teamIndustryIndustrialDrawerId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamIndustryIndustrialBuyerId_fkey" FOREIGN KEY ("teamIndustryIndustrialBuyerId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamIndustryIlId_fkey" FOREIGN KEY ("teamIndustryIlId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamIndustryDesignId_fkey" FOREIGN KEY ("teamIndustryDesignId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamIndustryConceptionEngineerId_fkey" FOREIGN KEY ("teamIndustryConceptionEngineerId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamBuCpLeaderId_fkey" FOREIGN KEY ("teamBuCpLeaderId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamBuCoLeader2Id_fkey" FOREIGN KEY ("teamBuCoLeader2Id") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_teamBuCoLeader1Id_fkey" FOREIGN KEY ("teamBuCoLeader1Id") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_categoryManagerCmId_fkey" FOREIGN KEY ("categoryManagerCmId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP9LmRuId_fkey" FOREIGN KEY ("CP9LmRuId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP7LmBrId_fkey" FOREIGN KEY ("CP7LmBrId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP6LmPlId_fkey" FOREIGN KEY ("CP6LmPlId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP5LmItId_fkey" FOREIGN KEY ("CP5LmItId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP53LmZaId_fkey" FOREIGN KEY ("CP53LmZaId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP3LmPtId_fkey" FOREIGN KEY ("CP3LmPtId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP38ZodioBrId_fkey" FOREIGN KEY ("CP38ZodioBrId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP2LmEsId_fkey" FOREIGN KEY ("CP2LmEsId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP26LmRoId_fkey" FOREIGN KEY ("CP26LmRoId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP23LmUaId_fkey" FOREIGN KEY ("CP23LmUaId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP22BricomanItId_fkey" FOREIGN KEY ("CP22BricomanItId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP21ZodioFrId_fkey" FOREIGN KEY ("CP21ZodioFrId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP20BricomanPlId_fkey" FOREIGN KEY ("CP20BricomanPlId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP1LmFrId_fkey" FOREIGN KEY ("CP1LmFrId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP19LmGrCyId_fkey" FOREIGN KEY ("CP19LmGrCyId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP18BricomartId_fkey" FOREIGN KEY ("CP18BricomartId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP17WeldomSerId_fkey" FOREIGN KEY ("CP17WeldomSerId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP14BricomanFrId_fkey" FOREIGN KEY ("CP14BricomanFrId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_CP10BricoCenterId_fkey" FOREIGN KEY ("CP10BricoCenterId") REFERENCES public."User"(id);' +
    'ALTER TABLE public."Collection" ADD CONSTRAINT "Collection_merchCollectionId_fkey" FOREIGN KEY ("merchCollectionId") REFERENCES public."MerchCollectionVersion"(id);' +
    'ALTER TABLE public."MerchCollectionVersionSecondaries" ADD CONSTRAINT "MerchCollectionVersionSecondaries_merchCollectionVersionId_fkey" FOREIGN KEY ("merchCollectionVersionId") REFERENCES public."MerchCollectionVersion"(id);' +
    'ALTER TABLE public."MerchCollectionVersionSecondaries" ADD CONSTRAINT "MerchCollectionVersionSecondaries_merchSecondaryVersionId_fkey" FOREIGN KEY ("merchSecondaryVersionId") REFERENCES public."MerchSecondaryVersion"(id);' +
    'ALTER TABLE public."MerchSecondaryVersion" ADD CONSTRAINT "MerchSecondaryVersion_merchSecondaryPlanId_fkey" FOREIGN KEY ("merchSecondaryPlanId") REFERENCES public."MerchSecondaryPlan"(id);' +
    'ALTER TABLE public."Activity" ADD CONSTRAINT "Activity_accountableUserId_fkey" FOREIGN KEY ("accountableUserId") REFERENCES public."User"(id);' +
    'CREATE INDEX "Collection_ttm_idx" ON public."Collection"(ttm);' +
    'CREATE INDEX "Collection_projectCode_idx" ON public."Collection"("projectCode");' +
    'CREATE INDEX "Style_matrixId_idx" ON public."Style"("matrixId");' +
    'CREATE INDEX "MerchSecondaryVersion_buLabel_idx" ON public."MerchSecondaryVersion"("buLabel");'

  try {
    await client.query(sqlString)
  } catch (err) {
    throw new Error(`Failed to create the database contraints: ${err}`)
  }
}

const bootstrapModels = async (client, DataTypes) => {
  const activityModel = ActivityModel.bootstrapModel(client, DataTypes)
  const styleBrandModel = StyleBrandModel.bootstrapModel(client, DataTypes)
  const specDataSheetModel = SpecDataSheetModel.bootstrapModel(client, DataTypes)
  const styleModel = StyleModel.bootstrapModel(client, DataTypes)
  const classifierModel = ClassifierModel.bootstrapModel(client, DataTypes)
  const collectionModel = CollectionModel.bootstrapModel(client, DataTypes)
  const specSectionModel = SpecSectionModel.bootstrapModel(client, DataTypes)
  const collectionSpecSectionModel = CollectionSpecSectionModel.bootstrapModel(client, DataTypes)
  const merchCollectionVersionModel = MerchCollectionVersionModel.bootstrapModel(client, DataTypes)
  const merchSecondaryVersionModel = MerchSecondaryVersionModel.bootstrapModel(client, DataTypes)
  const merchCollectionVersionSecondariesModel = MerchCollectionVersionSecondariesModel.bootstrapModel(client, DataTypes)
  const merchSecondaryPlanModel = MerchSecondaryPlanModel.bootstrapModel(client, DataTypes)
  const productSymbolModel = ProductSymbolModel.bootstrapModel(client, DataTypes)
  const specDataSheetItemModel = SpecDataSheetItemModel.bootstrapModel(client, DataTypes)
  const specDataSheetRevisionModel = SpecDataSheetRevisionModel.bootstrapModel(client, DataTypes)
  const specDataSheetRevisionItemModel = SpecDataSheetRevisionItemModel.bootstrapModel(client, DataTypes)
  const specItemDefinitionModel = SpecItemDefinitionModel.bootstrapModel(client, DataTypes)
  const specSectionItemModel = SpecSectionItemModel.bootstrapModel(client, DataTypes)
  const userModel = UserModel.bootstrapModel(client, DataTypes)
  const merchProductVersionSecondariesModel = MerchProductVersionSecondariesModel.bootstrapModel(client, DataTypes)
  const calendarActivitiesModel = CalendarActivitiesModel.bootstrapModel(client, DataTypes)
  const roleModel = RoleModel.bootstrapModel(client, DataTypes)
  const lookUpItemsModel = LookUpItemsModel.bootstrapModel(client, DataTypes)
  styleModel.belongsToMany(productSymbolModel, { through: styleBrandModel })

  styleModel.hasMany(merchProductVersionSecondariesModel, { foreignKey: 'merchProductVersionId', sourceKey: 'merchProductVersionId' })
  merchProductVersionSecondariesModel.belongsTo(merchSecondaryVersionModel, { foreignKey: 'merchSecondaryVersionId', sourceKey: 'id' })

  styleModel.hasOne(specDataSheetModel, { as: 'sds', foreignKey: 'id', sourceKey: 'specDataSheetId' })
  specDataSheetModel.belongsTo(specDataSheetRevisionModel, { foreignKey: 'currentRevisionId', sourceKey: 'id' })

  specDataSheetRevisionModel.hasOne(specSectionModel, { as: 'ss', foreignKey: 'id', sourceKey: 'specificationSectionId' })

  specDataSheetRevisionModel.belongsToMany(specDataSheetItemModel, { through: specDataSheetRevisionItemModel })
  specDataSheetItemModel.belongsTo(specSectionItemModel, { as: 'ssi', foreignKey: 'specificationSectionItemId', sourceKey: 'id' })
  specDataSheetItemModel.belongsTo(lookUpItemsModel, { as: 'ssiL', foreignKey: 'lookupItemId', sourceKey: 'id' })

  specSectionItemModel.belongsTo(specItemDefinitionModel, { as: 'sid', foreignKey: 'specificationItemDefinitionId', sourceKey: 'id' })

  styleModel.belongsTo(classifierModel, { as: 'segment', foreignKey: 'segmentId', sourceKey: 'id' })
  styleModel.belongsTo(classifierModel, { as: 'styleClass', foreignKey: 'styleId', sourceKey: 'id' })
  styleModel.belongsTo(classifierModel, { as: 'usage', foreignKey: 'usageId', sourceKey: 'id' })

  // business conditions

  // brief product development
  collectionModel.belongsToMany(specSectionModel, { as: 'models', through: collectionSpecSectionModel })
  collectionModel.belongsTo(userModel, { as: 'ProjectQualityManagerPQM', foreignKey: 'teamQualityPqmId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'IndustrialSerialLifeManager', foreignKey: 'teamQualityContinuousImprovementId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'SupplyChainOrganizerSCO', foreignKey: 'teamPurchaseSupplyScoId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'ProcurementManagerRAF', foreignKey: 'teamPurchaseSupplyRafId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'PurchasingLeaderPL', foreignKey: 'teamPurchaseSupplyPlId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'SourcingManager', foreignKey: 'teamPurchaseSourcingManagerId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'IndustrializationManager', foreignKey: 'teamPurchaseIndustrializationManagerId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'ProjectManagerRCP', foreignKey: 'teamProductRcpId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'ProductCommunityManagerPCM', foreignKey: 'teamProductPcmId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'InstructionManualManagerIMM', foreignKey: 'teamProductNoticeManagerId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'MarketLeader', foreignKey: 'teamProductMlId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CategoryLeader', foreignKey: 'teamProductLuiId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'DevelopmentLeader', foreignKey: 'teamProductDlId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CooperationLeaderCL', foreignKey: 'teamProductClId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CommunicationManagerCCO', foreignKey: 'teamProductCcpId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'BusinessSerialLifeManager', foreignKey: 'teamProductBusinessSerialLifeManagerId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'PackagingManager', foreignKey: 'teamIndustryPackId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'IndustrialDrawer', foreignKey: 'teamIndustryIndustrialDrawerId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'IndustrialBuyer', foreignKey: 'teamIndustryIndustrialBuyerId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'IndustrialLeaderIL', foreignKey: 'teamIndustryIlId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'Designer', foreignKey: 'teamIndustryDesignId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'ProductEngineer', foreignKey: 'teamIndustryConceptionEngineerId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'ProductManagerLeaderPML', foreignKey: 'teamBuCpLeaderId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CoLeaderProductManager2', foreignKey: 'teamBuCoLeader2Id', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CoLeaderProductManager1', foreignKey: 'teamBuCoLeader1Id', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CategoryManager', foreignKey: 'categoryManagerCmId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMRussia', foreignKey: 'CP9LmRuId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMBrazil', foreignKey: 'CP7LmBrId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMPoland', foreignKey: 'CP6LmPlId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMItaly', foreignKey: 'CP5LmItId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMSouthAfrica', foreignKey: 'CP53LmZaId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMPortugal', foreignKey: 'CP3LmPtId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPZodioBrazil', foreignKey: 'CP38ZodioBrId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMSpain', foreignKey: 'CP2LmEsId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMRomania', foreignKey: 'CP26LmRoId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMUkraine', foreignKey: 'CP23LmUaId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPBricomanIT', foreignKey: 'CP22BricomanItId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPZodioFrance', foreignKey: 'CP21ZodioFrId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPBricomanPoland', foreignKey: 'CP20BricomanPlId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMFrance', foreignKey: 'CP1LmFrId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPLMGreeceCyprus', foreignKey: 'CP19LmGrCyId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPBricomart', foreignKey: 'CP18BricomartId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPWeldomServices', foreignKey: 'CP17WeldomSerId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPBricomanFR', foreignKey: 'CP14BricomanFrId', sourceKey: 'id' })
  collectionModel.belongsTo(userModel, { as: 'CPBricocenter', foreignKey: 'CP10BricoCenterId', sourceKey: 'id' })

  collectionModel.hasOne(merchCollectionVersionModel, { as: 'mcv', foreignKey: 'id', sourceKey: 'merchCollectionId' })

  collectionModel.hasMany(calendarActivitiesModel, { foreignKey: 'calendarId', sourceKey: 'calendar' })
  calendarActivitiesModel.belongsTo(activityModel, { foreignKey: 'activityId', sourceKey: 'id' })

  merchCollectionVersionModel.belongsToMany(merchSecondaryVersionModel, { as: 'ressources', through: merchCollectionVersionSecondariesModel })
  merchCollectionVersionModel.belongsToMany(merchSecondaryVersionModel, { as: 'offices', through: merchCollectionVersionSecondariesModel })
  merchCollectionVersionModel.belongsToMany(merchSecondaryVersionModel, { as: 'overheads', through: merchCollectionVersionSecondariesModel })

  merchSecondaryVersionModel.belongsTo(merchSecondaryPlanModel, { as: 'msp', foreignKey: 'merchSecondaryPlanId', sourceKey: 'id' })

  // Milestone
  activityModel.belongsTo(userModel, { foreignKey: 'accountableUserId', sourceKey: 'id' })
  activityModel.belongsTo(roleModel, { foreignKey: 'accountableRoleId', sourceKey: 'id' })
}

export default {
  ClassifierModel,
  CollectionModel,
  CollectionSpecSectionModel,
  MerchCollectionVersionModel,
  MerchSecondaryPlanModel,
  MerchSecondaryVersionModel,
  ProductSymbolModel,
  SpecDataSheetModel,
  SpecDataSheetRevisionModel,
  SpecDataSheetRevisionItemModel,
  SpecDataSheetItemModel,
  SpecItemDefinitionModel,
  SpecSectionModel,
  SpecSectionItemModel,
  StyleBrandModel,
  StyleModel,
  UserModel,
  MerchCollectionVersionSecondariesModel,
  ActivityModel,
  MerchProductVersionSecondariesModel,
  CalendarActivitiesModel,
  RoleModel,
  LookUpItemsModel,
  bootstrapModels,
  dropSqlConstraintsAndIndexes,
  createSqlConstraintsAndIndexes
}
