import SpecDataSheetRevisionItem from '../tableDefinitions/SpecDataSheetRevisionItem'

const specDataSheetRevisionItem = new SpecDataSheetRevisionItem()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('specDataSheetRevisionItem',
    specDataSheetRevisionItem.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: specDataSheetRevisionItem.getTableName(),
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
