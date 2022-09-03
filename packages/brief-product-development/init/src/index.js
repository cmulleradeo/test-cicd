import Core from '@metric/acl-core'

import BriefProductDevelopmentApiToSql from './api-to-sql-brief-product-development'

new Core(
  [
    { plugin: BriefProductDevelopmentApiToSql, prefix: 'BRIEF_PRODUCT_DEVELOPMENT_API_TO_SQL' }
  ]
).setPlugins()
