/**
 * @module services/Logger
 * @description Core service for log generation.
 */

import winston from 'winston'

const transportsList = []

/**
 * Function to custom our own log printer and being able to create our own winston custom format.
 *
 * @param {object} obj - An object of parameters.
 * @param {string} obj.timestamp - Timestamp.
 * @param {string} obj.level - Log level (debug|info|warn|error).
 * @param {string} obj.message - Log message.
 * @param {string} [obj.exception] - Exception in case of error (stack trace).
 * @param {number} [obj.duration] - Duration in milliseconds.
 * @param {object} [obj.labels] - Log custom fields if useful (service, plugin, key...).
 * @returns {string} Log as JSON string.
 */
const customLogPrinter = ({ timestamp, level, message, exception, duration, labels }) => {
  return JSON.stringify({
    bu_code: ('BU_SHORT_NAME' in process.env) ? process.env.BU_SHORT_NAME : null,
    env: ('NODE_ENV' in process.env) ? process.env.NODE_ENV : null,
    project_tangram: ('PROJECT_TANGRAM' in process.env) ? process.env.PROJECT_TANGRAM : null,
    project_tangram_id: ('PROJECT_TANGRAM_ID' in process.env) ? process.env.PROJECT_TANGRAM_ID : null,
    log_timestamp: timestamp,
    level,
    logger: 'winston-logger',
    message,
    exception: exception?.stack || null,
    duration: duration || null,
    ...labels
  })
}

if (process.env.NODE_ENV !== 'local') {
  transportsList.push(new winston.transports.Console({
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.printf(customLogPrinter)
    )
  }))
} else {
  transportsList.push(new winston.transports.Console({
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(
      winston.format((info) => {
        info.level = info.level.toUpperCase()
        return info
      })(),
      winston.format.colorize(),
      winston.format.printf(({ level, message }) => `[${level}]: ${message}`)
    )
  }))
}

const logger = winston.createLogger({
  transports: transportsList
})

export {
  transportsList
}

export default logger
