import MerchCollectionVersion from '../tableDefinitions/MerchCollectionVersion'

const merchCollectionVersion = new MerchCollectionVersion()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('merchCollectionVersion',
    merchCollectionVersion.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: merchCollectionVersion.getTableName(),
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
