import Core from '@metric/acl-core'

import BriefProductDevelopmentKafkaToSql from './brief-product-development-kafka-to-sql'

new Core(
  [
    { plugin: BriefProductDevelopmentKafkaToSql, prefix: 'BRIEF_PRODUCT_DEVELOPMENT_KAFKA_TO_SQL' }
  ]
).setPlugins()
