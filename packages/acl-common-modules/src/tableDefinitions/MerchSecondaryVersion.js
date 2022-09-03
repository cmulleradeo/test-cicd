export default class MerchSecondaryVersion {
  /**
   * Return the data table name
   *
   * @returns {string} the data table name
   */
  getTableName = () => {
    return 'MerchSecondaryVersion'
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
      merchSecondaryPlanId: {
        type: DataTypes.INTEGER
      },
      secondaryType: {
        type: DataTypes.STRING
      },
      buLabel: {
        type: DataTypes.STRING
      },
      resourceCategory: {
        type: DataTypes.STRING
      },
      resourceTotalDays: {
        type: DataTypes.DOUBLE
      },
      officeLeader: {
        type: DataTypes.STRING
      },
      officeChallenger: {
        type: DataTypes.BOOLEAN
      },
      whosIn: {
        type: DataTypes.STRING
      },
      oVorResourceY: {
        type: DataTypes.DOUBLE
      },
      oVorResourceY1: {
        type: DataTypes.DOUBLE
      },
      oVorResourceY2: {
        type: DataTypes.DOUBLE
      },
      oVorResourceY3: {
        type: DataTypes.DOUBLE
      },
      totalCost: {
        type: DataTypes.DOUBLE
      },
      briefBUInhabitantAvailabilityDate: {
        type: DataTypes.DATE
      },
      briefBUTakingBackFormerRangeStock: {
        type: DataTypes.DOUBLE
      },
      briefBURebateFormerRange: {
        type: DataTypes.DOUBLE
      },
      briefBUMerchImplementation: {
        type: DataTypes.DOUBLE
      },
      briefBUImplementationEstimatedCost: {
        type: DataTypes.DOUBLE
      },
      briefBUImplementationFinancialHelp: {
        type: DataTypes.DOUBLE
      },
      BUName: {
        type: DataTypes.STRING
      },
      briefBUTurnoverExistingParameter: {
        type: DataTypes.DOUBLE
      },
      briefBUProjectSalesPerStore: {
        type: DataTypes.DOUBLE
      },
      briefBUTurnoverProjectProjections: {
        type: DataTypes.DOUBLE
      },
      briefBUNumberOfMatrixID: {
        type: DataTypes.INTEGER
      },
      briefBUNumberOfMatrixIDI2: {
        type: DataTypes.INTEGER
      },
      briefBUNumberOfMatrixIDI1: {
        type: DataTypes.INTEGER
      },
      briefBUMarketShareProjectFamilySalesRate: {
        type: DataTypes.DOUBLE
      },
      briefBUMarginRateEstimated3xNet: {
        type: DataTypes.DOUBLE
      },
      briefBUPurchasingGainFirstPrice: {
        type: DataTypes.DOUBLE
      },
      briefBUPurchasingGainFirstPriceRate: {
        type: DataTypes.DOUBLE
      },
      briefBUPurchasingGain: {
        type: DataTypes.DOUBLE
      },
      briefBUPurchasingAmount: {
        type: DataTypes.DOUBLE
      },
      briefBU3xNetMarginNewProductsRate: {
        type: DataTypes.DOUBLE
      },
      briefBU3xNetMarginNewProductsValidatedRate: {
        type: DataTypes.DOUBLE
      },
      briefBUSellingTurnoverFullYeatCommitments: {
        type: DataTypes.DOUBLE
      },
      briefBUPurchasingGainValidatedRate: {
        type: DataTypes.DOUBLE
      },
      briefBUPurchasingGainValidated: {
        type: DataTypes.DOUBLE
      },
      briefBUPurchasingAmountValidated: {
        type: DataTypes.DOUBLE
      },
      briefBUNumberOfMatrixIdCommitment: {
        type: DataTypes.INTEGER
      },
      briefBUNumberOfMatrixIdI2Commitment: {
        type: DataTypes.INTEGER
      },
      briefBUNumberOfMatrixIdI1Commitment: {
        type: DataTypes.INTEGER
      },
      BriefBUNumberOfShops: {
        type: DataTypes.DOUBLE
      },
      buId: {
        type: DataTypes.STRING
      },
      comment: {
        type: DataTypes.STRING
      },
      expected3xNetBuyPriceStore: {
        type: DataTypes.DOUBLE
      },
      expectedBusinessWarrantyPersio: {
        type: DataTypes.INTEGER
      },
      expectedMerchandising: {
        type: DataTypes.STRING
      },
      expectedMoq: {
        type: DataTypes.DOUBLE
      },
      expectedRangeLetter: {
        type: DataTypes.STRING
      },
      expectedSellPriceForCustomer: {
        type: DataTypes.DOUBLE
      },
      freezeForecast: {
        type: DataTypes.BOOLEAN
      },
      expectedDeveliveryPromiseOnline: {
        type: DataTypes.STRING
      },
      expectedDeveliveryPromisePhysical: {
        type: DataTypes.STRING
      },
      expectedImplementationDate: {
        type: DataTypes.DATE
      },
      expectedForcastedSellingTO: {
        type: DataTypes.DOUBLE
      },
      expectedAnnualSelloutForecastQtity: {
        type: DataTypes.DOUBLE
      },
      currentNewProduction: {
        type: DataTypes.STRING
      },
      currentRefBU: {
        type: DataTypes.STRING
      },
      gtin: {
        type: DataTypes.STRING
      },
      gtinSecondary: {
        type: DataTypes.STRING
      },
      finalNbSampleRequest: {
        type: DataTypes.INTEGER
      },
      finalNbSampleRequestShowRoom: {
        type: DataTypes.INTEGER
      },
      freezeCommitment: {
        type: DataTypes.BOOLEAN
      },
      gtinFinal: {
        type: DataTypes.STRING
      },
      finalComitmentSellingTo: {
        type: DataTypes.DOUBLE
      },
      expectedAnnualSelloutComitment: {
        type: DataTypes.DOUBLE
      },
      expectedFirstImplementationQtity: {
        type: DataTypes.DOUBLE
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
