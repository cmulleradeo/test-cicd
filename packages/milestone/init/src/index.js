import Core from '@metric/acl-core'

import MilestoneApiToSql from './api-to-sql-milestone'

new Core(
  [
    { plugin: MilestoneApiToSql, prefix: 'MILESTONE_API_TO_SQL' }
  ]
).setPlugins()
