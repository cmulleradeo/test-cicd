import sequelize from 'sequelize'
import { sqlModels } from '@metric/acl-common-modules'

const Op = sequelize.Op
const {
  UserModel,
  MerchCollectionVersionModel,
  MerchSecondaryVersionModel,
  MerchSecondaryPlanModel
} = sqlModels

export const includeUsers = () => {
  return [
    {
      model: UserModel.getModel(),
      as: 'ProjectQualityManagerPQM',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'IndustrialSerialLifeManager',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'SupplyChainOrganizerSCO',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'ProcurementManagerRAF',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'PurchasingLeaderPL',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'SourcingManager',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'IndustrializationManager',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'ProjectManagerRCP',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'ProductCommunityManagerPCM',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'InstructionManualManagerIMM',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'MarketLeader',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CategoryLeader',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'DevelopmentLeader',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CooperationLeaderCL',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CommunicationManagerCCO',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'BusinessSerialLifeManager',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'PackagingManager',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'IndustrialDrawer',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'IndustrialBuyer',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'IndustrialLeaderIL',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'Designer',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'ProductEngineer',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'ProductManagerLeaderPML',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CoLeaderProductManager2',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CoLeaderProductManager1',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CategoryManager',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMRussia',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMBrazil',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMPoland',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMItaly',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMSouthAfrica',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMPortugal',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPZodioBrazil',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMSpain',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMRomania',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMUkraine',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPBricomanIT',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPZodioFrance',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPBricomanPoland',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMFrance',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPLMGreeceCyprus',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPBricomart',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPWeldomServices',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPBricomanFR',
      attributes: ['ldap', 'email']
    }, {
      model: UserModel.getModel(),
      as: 'CPBricocenter',
      attributes: ['ldap', 'email']
    }
  ]
}

export const includeMerchCollectionVersions = () => {
  return {
    model: MerchCollectionVersionModel.getModel(),
    as: 'mcv',
    attributes: ['briefProjectSalesCreation', 'briefROIInYear', 'briefDevelopmentCostsHumanResources', 'projectSalesPerStoreAtTttm', 'briefProjectSalesI1I2Rate', 'briefGlobalNumberOfMatrixIdI1', 'briefGlobalNumberOfMatrixIdI2', 'briefGlobalNumberOFMatrixId', 'briefTurnoverProjectProjection', 'briefProjectionQuantityOfBU', 'briefNewSaleExtraMargin', 'briefDvptCostsOverheads', 'briefListOfBu', 'briefImplementationCostsBuAndAdeo', 'briefPurchasingGain', 'briefPurchaseGainRate', 'briefTurnoverSalesFullYearProjection', 'briefExtraMarginFromNewSales', 'briefTurnoverSalesFullYearExistingPerimeter', 'briefPurchasingAmount'],
    include: [{
      model: MerchSecondaryVersionModel.getModel(),
      as: 'ressources',
      attributes: ['secondaryType', 'resourceCategory', 'oVorResourceY', 'oVorResourceY1', 'oVorResourceY2', 'oVorResourceY3', 'resourceTotalDays', 'totalCost'],
      through: {
        attributes: []
      },
      where: {
        secondaryType: {
          [Op.eq]: 'Ressources'
        }
      },
      required: false,
      include: [{
        model: MerchSecondaryPlanModel.getModel(),
        as: 'msp',
        attributes: ['nodeName']
      }]
    }, {
      model: MerchSecondaryVersionModel.getModel(),
      as: 'offices',
      attributes: ['secondaryType', 'officeChallenger', 'officeLeader'],
      through: {
        attributes: []
      },
      where: {
        secondaryType: {
          [Op.eq]: 'offices'
        }
      },
      required: false,
      include: [{
        model: MerchSecondaryPlanModel.getModel(),
        as: 'msp',
        attributes: ['nodeName'],
        required: false
      }]
    }, {
      model: MerchSecondaryVersionModel.getModel(),
      as: 'overheads',
      attributes: ['secondaryType', 'whosIn', 'oVorResourceY', 'oVorResourceY1', 'oVorResourceY2', 'oVorResourceY3', 'totalCost'],
      through: {
        attributes: []
      },
      where: {
        secondaryType: {
          [Op.eq]: 'Overheads'
        }
      },
      required: false,
      include: [{
        model: MerchSecondaryPlanModel.getModel(),
        as: 'msp',
        attributes: ['nodeName']
      }]
    }]
  }
}
