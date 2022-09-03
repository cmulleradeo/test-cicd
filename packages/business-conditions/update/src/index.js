import Core from '@metric/acl-core'

import BusinessConditionsKafkaToSql from './business-conditions-kafka-to-sql'

new Core(
  [
    { plugin: BusinessConditionsKafkaToSql, prefix: 'BUSINESS_CONDITIONS_KAFKA_TO_SQL' }
  ]
).setPlugins()
