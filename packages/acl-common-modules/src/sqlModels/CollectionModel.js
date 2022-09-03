import Collection from '../tableDefinitions/Collection'

const collection = new Collection()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('collection',
    collection.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: collection.getTableName(),
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
