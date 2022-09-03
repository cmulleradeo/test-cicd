import User from '../tableDefinitions/User'

const user = new User()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('user',
    user.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: user.getTableName(),
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
