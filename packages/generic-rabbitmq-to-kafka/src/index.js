import Core from '@metric/acl-core'

import PluginRabbitMqToKafka from './plugin-rabbitmq-to-kafka'

new Core(
  [
    { plugin: PluginRabbitMqToKafka, prefix: 'RABBIT_MQ_TO_KAFKA' }
  ]
).setPlugins()
