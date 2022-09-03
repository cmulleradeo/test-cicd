import path from 'path'

/**
 * Get a var from the environment. Resolves the prefix.
 *
 * @param {string} name - Var name.
 * @returns {any} Env var value.
 */
function getEnvVar (name) {
  return process.env[`${process.env.ENV_PREFIX}${name}`]
}

export default {
  app: {
    version: process.env.npm_package_version,
    env: getEnvVar('ENV') || process.env.NODE_ENV
  },

  server: {
    port: +(getEnvVar('PORT') || 9000)
  },

  logger: {
    level: getEnvVar('LOGGER_LEVEL') || 'info',
    stackdriver: {
      enable: String(getEnvVar('LOGGER_STACKDRIVER_ENABLE')).toLowerCase() === 'true',
      level: getEnvVar('LOGGER_SATCKDRIVER_LEVEL') || getEnvVar('LOGGER_LEVEL') || 'info',
      name: getEnvVar('LOGGER_STACKDRIVER_NAME') || '',
      projectId: getEnvVar('LOGGER_STACKDRIVER_PROJECT_ID') || '',
      keyFilename: getEnvVar('LOGGER_STACKDRIVER_KEY_FILENAME') || ''
    }
  },

  postgres: {
    type: getEnvVar('DB_TYPE'),
    user: getEnvVar('DB_USER'),
    password: getEnvVar('DB_PWD'),
    host: getEnvVar('DB_HOST'),
    port: getEnvVar('DB_PORT'),
    name: getEnvVar('DB_NAME'),
    useSsl: getEnvVar('DB_USE_SSL') === 'true'
  },

  swagger: {
    enabled: getEnvVar('SWAGGER_ENABLED') === 'true',
    specFilePath: path.join(__dirname, 'swagger.json')
  }
}
