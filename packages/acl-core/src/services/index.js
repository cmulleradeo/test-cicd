import KafkaConsumer from './KafkaJS/ConsumerGroup'
import KafkaProducer from './KafkaJS/Producer'
import Logger from './Logger'
import SQL from './SQL'
import Datadog from './Datadog'
import ErrorHandler from './ErrorHandler'
import RabbitMQConsumer from './RabbitMQ/Consumer'

const servicesCores = {
  KafkaConsumer,
  KafkaProducer,
  Logger,
  SQL,
  Datadog,
  ErrorHandler,
  RabbitMQConsumer
}

export default servicesCores
