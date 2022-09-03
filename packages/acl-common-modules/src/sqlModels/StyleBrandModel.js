import StyleBrand from '../tableDefinitions/StyleBrand'

const styleBrand = new StyleBrand()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('styleBrand',
    styleBrand.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: styleBrand.getTableName(),
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
