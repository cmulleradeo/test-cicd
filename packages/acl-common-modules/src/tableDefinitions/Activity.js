export default class Activity {
  /**
   * Return the data table name
   *
   * @returns {string} the data table name
   */
  getTableName = () => {
    return 'Activity'
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
      accountableUserId: {
        type: DataTypes.INTEGER
      },
      accountableRoleId: {
        type: DataTypes.INTEGER
      },
      index: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.TEXT
      },
      details: {
        type: DataTypes.TEXT
      },
      initialDate: {
        type: DataTypes.DATE
      },
      revisedDate: {
        type: DataTypes.DATE
      },
      completionDate: {
        type: DataTypes.DATE
      },
      stepStatus: {
        type: DataTypes.STRING
      },
      stepType: {
        type: DataTypes.STRING
      },
      referenceMilestone: {
        type: DataTypes.STRING
      },
      essentialDeliverable: {
        type: DataTypes.STRING
      },
      deliverableType: {
        type: DataTypes.STRING
      },
      deliverableStatus: {
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
