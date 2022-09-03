import Core from '@metric/acl-core'

import ProjectProductDevelopmentApiToSql from './api-to-sql-project-product-development'

new Core(
  [
    { plugin: ProjectProductDevelopmentApiToSql, prefix: 'PROJECT_PRODUCT_DEVELOPMENT_API_TO_SQL' }
  ]
).setPlugins()
