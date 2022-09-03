import SpecificationItemDefinition from '../tableDefinitions/SpecItemDefinition'

const specificationItemDefinition = new SpecificationItemDefinition()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('specItemDefinition',
    specificationItemDefinition.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: specificationItemDefinition.getTableName(),
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
