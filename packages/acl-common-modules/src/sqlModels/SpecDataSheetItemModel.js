import SpecificationDataSheetItem from '../tableDefinitions/SpecDataSheetItem'

const specificationDataSheetItem = new SpecificationDataSheetItem()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('specDataSheetItem',
    specificationDataSheetItem.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: specificationDataSheetItem.getTableName(),
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
