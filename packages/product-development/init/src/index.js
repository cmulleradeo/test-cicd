import Core from '@metric/acl-core'

import ProductDevelopmentApiToSql from './api-to-sql-product-development'

new Core(
  [
    { plugin: ProductDevelopmentApiToSql, prefix: 'PRODUCT_DEVELOPMENT_API_TO_SQL' }
  ]
).setPlugins()
