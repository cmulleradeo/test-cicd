import SpecDataSheet from '../tableDefinitions/SpecDataSheet'

const specDataSheet = new SpecDataSheet()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('specDataSheet',
    specDataSheet.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: specDataSheet.getTableName(),
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
