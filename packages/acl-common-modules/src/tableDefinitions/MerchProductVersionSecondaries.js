export default class MerchProductVersionSecondaries {
  /**
   * Return the data table name
   *
   * @returns {string} the data table name
   */
  getTableName = () => {
    return 'MerchProductVersionSecondaries'
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
      merchProductVersionId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      merchSecondaryVersionId: {
        type: DataTypes.INTEGER,
        primaryKey: true
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
