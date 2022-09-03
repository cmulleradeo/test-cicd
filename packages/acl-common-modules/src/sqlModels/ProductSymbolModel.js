import ProductSymbol from '../tableDefinitions/ProductSymbol'

const productSymbol = new ProductSymbol()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('productSymbol',
    productSymbol.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: productSymbol.getTableName(),
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
