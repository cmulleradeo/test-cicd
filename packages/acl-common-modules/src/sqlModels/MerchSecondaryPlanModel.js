import MerchSecondaryPlan from '../tableDefinitions/MerchSecondaryPlan'

const merchSecondaryPlan = new MerchSecondaryPlan()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('merchSecondaryPlan',
    merchSecondaryPlan.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: merchSecondaryPlan.getTableName(),
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
