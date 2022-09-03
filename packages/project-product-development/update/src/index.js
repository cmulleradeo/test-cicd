import Core from '@metric/acl-core'

import ProjectProductDevelopmentKafkaToSql from './project-product-development-kafka-to-sql'

new Core(
  [
    { plugin: ProjectProductDevelopmentKafkaToSql, prefix: 'PROJECT_PRODUCT_DEVELOPMENT_KAFKA_TO_SQL' }
  ]
).setPlugins()
