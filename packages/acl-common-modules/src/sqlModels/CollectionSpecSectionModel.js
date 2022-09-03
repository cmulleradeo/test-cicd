import CollectionSpecSection from '../tableDefinitions/CollectionSpecSection'

const collectionSpecSection = new CollectionSpecSection()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('collectionSpecSection',
    collectionSpecSection.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: collectionSpecSection.getTableName(),
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
