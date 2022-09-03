import Style from '../tableDefinitions/Style'

const style = new Style()
let model

const bootstrapModel = (sequelize, DataTypes, initIndexes = false) => {
  model = sequelize.define('style',
    style.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: style.getTableName(),
      createdAt: false,
      updatedAt: false,
      indexes: initIndexes ? [{ unique: false, fields: ['matrixId'] }] : []
    }
  )

  return model
}

const getModel = () => model

export default {
  bootstrapModel,
  getModel
}
