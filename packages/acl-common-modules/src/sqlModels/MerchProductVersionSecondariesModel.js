import MerchProductVersionSecondaries from '../tableDefinitions/MerchProductVersionSecondaries'

const merchProductVersionSecondaries = new MerchProductVersionSecondaries()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('merchProductVersionSecondaries',
    merchProductVersionSecondaries.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: merchProductVersionSecondaries.getTableName(),
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
