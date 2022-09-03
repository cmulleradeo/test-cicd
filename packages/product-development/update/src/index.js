import Core from '@metric/acl-core'

import ProductDevelopmentKafkaToSql from './product-development-kafka-to-sql'

new Core(
  [
    { plugin: ProductDevelopmentKafkaToSql, prefix: 'PRODUCT_DEVELOPMENT_KAFKA_TO_SQL' }
  ]
).setPlugins()
