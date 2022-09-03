export default class Collection {
  /**
   * Return the data table name
   *
   * @returns {string} the data table name
   */
  getTableName = () => {
    return 'Collection'
  }

  /**
   * Return attributes of the events table, necessary for the instantiation of the Sequelize Model
   * See {@link https://sequelize.org/master/class/lib/model.js~Model.html#static-method-init|Sequelize init() method} for further information
   *
   * @param {object} DataTypes SQL service DataTypes
   * @returns {object} Object containing table attributes
   */
  getAttributes = (DataTypes) => {
    return {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      projectCode: {
        type: DataTypes.STRING
      },
      merchCollectionId: {
        type: DataTypes.INTEGER
      },
      calendar: {
        type: DataTypes.INTEGER
      },
      briefTurnoverForTender: {
        type: DataTypes.DOUBLE
      },
      briefNumberOfTenderRound: {
        type: DataTypes.STRING
      },
      briefNumberOfProductsForTender: {
        type: DataTypes.INTEGER
      },
      briefExpectedIndustrialLevel: {
        type: DataTypes.STRING
      },
      briefExpectedCostBreakdownLevel: {
        type: DataTypes.STRING
      },
      briefSupplyChainValueCreation: {
        type: DataTypes.STRING
      },
      briefConceptionValueCreation: {
        type: DataTypes.STRING
      },
      briefQualityValueCreation: {
        type: DataTypes.STRING
      },
      briefPurchasingValueCreation: {
        type: DataTypes.STRING
      },
      briefOfferValueCreation: {
        type: DataTypes.STRING
      },
      briefCommercializationValueCreation: {
        type: DataTypes.STRING
      },
      briefMadeFromResponsibleProductionValueCreation: {
        type: DataTypes.STRING
      },
      briefBringSustainableFeaturesValueCreation: {
        type: DataTypes.STRING
      },
      briefMadeToLastValueCreation: {
        type: DataTypes.STRING
      },
      briefMadeFromSustainableAndRecycledRessourcesValueCreation: {
        type: DataTypes.STRING
      },
      briefSafeForPlanetAndPeopleValueCreation: {
        type: DataTypes.STRING
      },
      briefSubDepartment01: {
        type: DataTypes.STRING
      },
      briefSubDepartment02: {
        type: DataTypes.STRING
      },
      briefSubDepartment03: {
        type: DataTypes.STRING
      },
      briefSubDepartment04: {
        type: DataTypes.STRING
      },
      briefSubDepartment05: {
        type: DataTypes.STRING
      },
      briefCurrentReturnRate: {
        type: DataTypes.DOUBLE
      },
      briefTargetReturnRate: {
        type: DataTypes.DOUBLE
      },
      pitch: {
        type: DataTypes.TEXT
      },
      intellectualProperty: {
        type: DataTypes.BOOLEAN
      },
      briefFamily01: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      briefFamily02: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      briefFamily03: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      briefFamily04: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      briefFamily05: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      keyFactorsOfSuccess: {
        type: DataTypes.TEXT
      },
      briefSelectionRate: {
        type: DataTypes.DOUBLE
      },
      briefConceptionRate: {
        type: DataTypes.DOUBLE
      },
      briefCoDevelopementRate: {
        type: DataTypes.DOUBLE
      },
      briefDepartment01: {
        type: DataTypes.STRING
      },
      briefDepartment02: {
        type: DataTypes.STRING
      },
      briefDepartment03: {
        type: DataTypes.STRING
      },
      briefDepartment04: {
        type: DataTypes.STRING
      },
      briefDepartment05: {
        type: DataTypes.STRING
      },
      briefTargetCustomerFeedback: {
        type: DataTypes.DOUBLE
      },
      briefCurrentCustomerFeedback: {
        type: DataTypes.DOUBLE
      },
      briefTargetAfterSalesService: {
        type: DataTypes.STRING
      },
      briefCurrentAfterSalesService: {
        type: DataTypes.STRING
      },
      teamQualityPqmId: {
        type: DataTypes.INTEGER
      },
      teamQualityContinuousImprovementId: {
        type: DataTypes.INTEGER
      },
      teamPurchaseSupplyScoId: {
        type: DataTypes.INTEGER
      },
      teamPurchaseSupplyRafId: {
        type: DataTypes.INTEGER
      },
      teamPurchaseSupplyPlId: {
        type: DataTypes.INTEGER
      },
      teamPurchaseSourcingManagerId: {
        type: DataTypes.INTEGER
      },
      teamPurchaseIndustrializationManagerId: {
        type: DataTypes.INTEGER
      },
      teamProductRcpId: {
        type: DataTypes.INTEGER
      },
      teamProductPcmId: {
        type: DataTypes.INTEGER
      },
      teamProductNoticeManagerId: {
        type: DataTypes.INTEGER
      },
      teamProductMlId: {
        type: DataTypes.INTEGER
      },
      teamProductLuiId: {
        type: DataTypes.INTEGER
      },
      teamProductDlId: {
        type: DataTypes.INTEGER
      },
      teamProductClId: {
        type: DataTypes.INTEGER
      },
      teamProductCcpId: {
        type: DataTypes.INTEGER
      },
      teamProductBusinessSerialLifeManagerId: {
        type: DataTypes.INTEGER
      },
      teamIndustryPackId: {
        type: DataTypes.INTEGER
      },
      teamIndustryIndustrialDrawerId: {
        type: DataTypes.INTEGER
      },
      teamIndustryIndustrialBuyerId: {
        type: DataTypes.INTEGER
      },
      teamIndustryIlId: {
        type: DataTypes.INTEGER
      },
      teamIndustryDesignId: {
        type: DataTypes.INTEGER
      },
      teamIndustryConceptionEngineerId: {
        type: DataTypes.INTEGER
      },
      teamBuCpLeaderBu: {
        type: DataTypes.STRING
      },
      teamBuCpLeaderId: {
        type: DataTypes.INTEGER
      },
      teamBuCoLeader2Id: {
        type: DataTypes.INTEGER
      },
      teamBuCoLeader1Id: {
        type: DataTypes.INTEGER
      },
      categoryManagerCmId: {
        type: DataTypes.INTEGER
      },
      CP9LmRuId: {
        type: DataTypes.INTEGER
      },
      CP7LmBrId: {
        type: DataTypes.INTEGER
      },
      CP6LmPlId: {
        type: DataTypes.INTEGER
      },
      CP5LmItId: {
        type: DataTypes.INTEGER
      },
      CP53LmZaId: {
        type: DataTypes.INTEGER
      },
      CP3LmPtId: {
        type: DataTypes.INTEGER
      },
      CP38ZodioBrId: {
        type: DataTypes.INTEGER
      },
      CP2LmEsId: {
        type: DataTypes.INTEGER
      },
      CP26LmRoId: {
        type: DataTypes.INTEGER
      },
      CP23LmUaId: {
        type: DataTypes.INTEGER
      },
      CP22BricomanItId: {
        type: DataTypes.INTEGER
      },
      CP21ZodioFrId: {
        type: DataTypes.INTEGER
      },
      CP20BricomanPlId: {
        type: DataTypes.INTEGER
      },
      CP1LmFrId: {
        type: DataTypes.INTEGER
      },
      CP19LmGrCyId: {
        type: DataTypes.INTEGER
      },
      CP18BricomartId: {
        type: DataTypes.INTEGER
      },
      CP17WeldomSerId: {
        type: DataTypes.INTEGER
      },
      CP14BricomanFrId: {
        type: DataTypes.INTEGER
      },
      CP10BricoCenterId: {
        type: DataTypes.INTEGER
      },
      ttm: {
        type: DataTypes.STRING
      },
      projectName: {
        type: DataTypes.STRING
      },
      projectType: {
        type: DataTypes.STRING
      },
      projectInitialCode: {
        type: DataTypes.STRING
      },
      category1Id: {
        type: DataTypes.INTEGER
      },
      category1Value: {
        type: DataTypes.STRING
      },
      category2Id: {
        type: DataTypes.INTEGER
      },
      category2Value: {
        type: DataTypes.STRING
      },
      projectScope: {
        type: DataTypes.STRING
      },
      projectQualification: {
        type: DataTypes.STRING
      },
      projectLifeTime: {
        type: DataTypes.DOUBLE
      },
      projectStatus: {
        type: DataTypes.STRING
      },
      projectMdhScope: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }
  }
}
