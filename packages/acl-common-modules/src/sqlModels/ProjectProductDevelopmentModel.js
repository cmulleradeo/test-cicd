import ProjectProductDevelopment from '../tableDefinitions/ProjectProductDevelopment'

const projectProductDevelopment = new ProjectProductDevelopment()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('projectProductDevelopment',
    projectProductDevelopment.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: projectProductDevelopment.getTableName(),
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
