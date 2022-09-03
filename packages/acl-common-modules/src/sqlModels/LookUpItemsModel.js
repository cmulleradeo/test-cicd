import LookUpItems from '../tableDefinitions/LookUpItems'

const lookUpItems = new LookUpItems()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('lookUpItem',
    lookUpItems.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: lookUpItems.getTableName(),
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
