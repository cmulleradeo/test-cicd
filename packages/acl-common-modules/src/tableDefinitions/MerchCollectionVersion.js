export default class MerchCollectionVersion {
  /**
   * Return the data table name
   *
   * @returns {string} the data table name
   */
  getTableName = () => {
    return 'MerchCollectionVersion'
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
      briefProjectSalesCreation: {
        type: DataTypes.DOUBLE
      },
      briefROIInYear: {
        type: DataTypes.DOUBLE
      },
      briefDevelopmentCostsHumanResources: {
        type: DataTypes.DOUBLE
      },
      projectSalesPerStoreAtTttm: {
        type: DataTypes.DOUBLE
      },
      briefProjectSalesI1I2Rate: {
        type: DataTypes.DOUBLE
      },
      briefGlobalNumberOfMatrixIdI2: {
        type: DataTypes.INTEGER
      },
      briefGlobalNumberOfMatrixIdI1: {
        type: DataTypes.INTEGER
      },
      briefGlobalNumberOFMatrixId: {
        type: DataTypes.INTEGER
      },
      briefTurnoverProjectProjection: {
        type: DataTypes.DOUBLE
      },
      briefProjectionQuantityOfBU: {
        type: DataTypes.INTEGER
      },
      briefNewSaleExtraMargin: {
        type: DataTypes.DOUBLE
      },
      briefDvptCostsOverheads: {
        type: DataTypes.DOUBLE
      },
      briefListOfBu: {
        type: DataTypes.TEXT
      },
      briefImplementationCostsBuAndAdeo: {
        type: DataTypes.DOUBLE
      },
      briefPurchasingGain: {
        type: DataTypes.DOUBLE
      },
      briefPurchaseGainRate: {
        type: DataTypes.DOUBLE
      },
      briefTurnoverSalesFullYearProjection: {
        type: DataTypes.DOUBLE
      },
      briefExtraMarginFromNewSales: {
        type: DataTypes.DOUBLE
      },
      briefTurnoverSalesFullYearExistingPerimeter: {
        type: DataTypes.DOUBLE
      },
      briefPurchasingAmount: {
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
