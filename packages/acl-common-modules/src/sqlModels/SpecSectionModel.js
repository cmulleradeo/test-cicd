import SpecificationSection from '../tableDefinitions/SpecSection'

const specificationSection = new SpecificationSection()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('specSection',
    specificationSection.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: specificationSection.getTableName(),
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
