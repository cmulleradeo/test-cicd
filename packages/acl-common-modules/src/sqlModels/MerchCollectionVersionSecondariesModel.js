import MerchCollectionVersionSecondaries from '../tableDefinitions/MerchCollectionVersionSecondaries'

const merchCollectionVersionSecondaries = new MerchCollectionVersionSecondaries()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('merchCollectionVersionSecondaries',
    merchCollectionVersionSecondaries.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: merchCollectionVersionSecondaries.getTableName(),
      createdAt: false,
      updatedAt: false
    }
  )

  model.removeAttribute('id')

  return model
}

const getModel = () => model

export default {
  bootstrapModel,
  getModel
}
