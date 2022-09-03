import Role from '../tableDefinitions/Role'

const role = new Role()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('role',
    role.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: role.getTableName(),
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
