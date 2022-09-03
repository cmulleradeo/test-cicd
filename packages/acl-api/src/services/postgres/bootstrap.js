import { Sequelize } from 'sequelize'

import bootstrapModels from './index'

import config from 'config/env'

export default async () => {
  const { postgres } = config
  const postgresOptions = {
    host: postgres.host,
    port: postgres.port,
    dialect: postgres.type,
    logging: null
  }
  if (postgres.useSsl) {
    postgresOptions.dialectOptions = {
      ssl: {
        require: postgres.useSsl,
        rejectUnauthorized: false
      }
    }
  }
  const client = new Sequelize(postgres.name, postgres.user, postgres.password, {
    define: {
      hooks: {
        afterFind (record, options) {
          if (!record) {
            return
          }

          if (record.constructor === Array) {
            record.forEach((element) => {
              delete element.dataValues.createdAt
              delete element.dataValues.updatedAt
            })
          } else {
            delete record.dataValues.createdAt
            delete record.dataValues.updatedAt
          }
        }
      }
    },
    ...postgresOptions
  })

  try {
    await client.authenticate()
  } catch (err) {
    throw new Error(`Connection failed to the database: ${err.message}\nConnection string: ${postgres.user}@${postgres.host}:${postgres.port}/${postgres.name}`)
  }

  try {
    await bootstrapModels(client)
  } catch (err) {
    // If it's a validation error from sequelize, the property errors exists
    const message = err.errors
      ? err.errors.reduce((acc, cur) => (acc + `\n${cur}`), 0)
      : err.message

    throw new Error(`Failed to bootstrap the SQL models: ${message}`)
  }
}
