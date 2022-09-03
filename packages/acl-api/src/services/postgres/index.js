import { DataTypes } from 'sequelize'

import { sqlModels } from '@metric/acl-common-modules'

const bootstrapModels = async (client) => {
  try {
    await sqlModels.createSqlConstraintsAndIndexes(client)
  } catch (err) {
    throw new Error(`Failed to create the SQL constraints: ${err}`)
  }

  try {
    await sqlModels.bootstrapModels(client, DataTypes)
    await client.sync({ alter: true })
  } catch (err) {
    throw new Error(`Failed to synchronize the models with the database: ${err}`)
  }
}

export default bootstrapModels
