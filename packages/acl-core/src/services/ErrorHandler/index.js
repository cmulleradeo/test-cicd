import Logger from '../Logger'

import DatadogError from './Errors/DatadogError'
import MetricBaseError from './Errors/MetricBaseError'
import ConfigError from './Errors/ConfigError'
import GoogleStorageError from './Errors/GoogleStorageError'
import NoSqlError from './Errors/NoSqlError'
import SchemaRegistryError from './Errors/SchemaRegistryError'
import KafkaError from './Errors/KafkaError'
import PubSubError from './Errors/PubSubError'
import SqlError from './Errors/SqlError'
import PluginError from './Errors/PluginError'
import AxiosError from './Errors/AxiosError'
import RabbitMqError from './Errors/RabbitMqError'
import PgValidationError from './Errors/PgValidationError'

/**
 * Handler for logging custom Metric ACL errors
 *
 * @param {Error} err The error to handle
 */
const errorHandler = (err) => {
  if (err instanceof MetricBaseError) {
    Logger.error(err.formatMessage(), err.formatError())
  } else {
    Logger.error('Unkown error - ' + err.message, { exception: err.stack })
  }
}

export default {
  errorHandler,
  MetricBaseError,
  ConfigError,
  DatadogError,
  GoogleStorageError,
  SchemaRegistryError,
  NoSqlError,
  KafkaError,
  PubSubError,
  SqlError,
  PluginError,
  AxiosError,
  RabbitMqError,
  PgValidationError
}
