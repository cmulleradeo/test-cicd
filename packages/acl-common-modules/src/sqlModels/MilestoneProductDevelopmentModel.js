import MilestoneProductDevelopment from '../tableDefinitions/MilestoneProductDevelopment'

const milestoneProductDevelopment = new MilestoneProductDevelopment()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('milestoneProductDevelopment',
    milestoneProductDevelopment.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: milestoneProductDevelopment.getTableName(),
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
