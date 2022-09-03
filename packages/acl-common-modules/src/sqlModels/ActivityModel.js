import Activity from '../tableDefinitions/Activity'

const activity = new Activity()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('activity',
    activity.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: activity.getTableName(),
      createdAt: false,
      updatedAt: false
    }
  )

  return model
}

const getModel = () => model

export default {
  bootstrapModel,
  getModel
}
