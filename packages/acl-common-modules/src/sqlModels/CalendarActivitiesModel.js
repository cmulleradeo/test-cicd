import CalendarActivities from '../tableDefinitions/CalendarActivities'

const calendarActivities = new CalendarActivities()
let model

const bootstrapModel = (sequelize, DataTypes) => {
  model = sequelize.define('calendarActivities',
    calendarActivities.getAttributes(DataTypes),
    {
      freezeTableName: true,
      tableName: calendarActivities.getTableName(),
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
