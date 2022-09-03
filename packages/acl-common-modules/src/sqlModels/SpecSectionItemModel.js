import SpecificationSectionItem from '../tableDefinitions/SpecSectionItem'

const specificationSectionItem = new SpecificationSectionItem()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('specSectionitem',
    specificationSectionItem.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: specificationSectionItem.getTableName(),
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
