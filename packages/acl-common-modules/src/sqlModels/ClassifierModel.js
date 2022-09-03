import Classifier from '../tableDefinitions/Classifier'

const classifier = new Classifier()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('classifier',
    classifier.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: classifier.getTableName(),
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
