import MerchSecondaryVersion from '../tableDefinitions/MerchSecondaryVersion'

const merchSecondaryVersion = new MerchSecondaryVersion()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('merchSecondaryVersion',
    merchSecondaryVersion.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: merchSecondaryVersion.getTableName(),
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
