export default class LookUpItems {
  /**
     * Return the data table name
     *
     * @returns {string} the data table name
     */
  getTableName = () => {
    return 'LookUpItems'
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
      code: {
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
