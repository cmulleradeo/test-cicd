import SpecDataSheetRevision from '../tableDefinitions/SpecDataSheetRevision'

const specDataSheetRevision = new SpecDataSheetRevision()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('specDataSheetRevision',
    specDataSheetRevision.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: specDataSheetRevision.getTableName(),
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
