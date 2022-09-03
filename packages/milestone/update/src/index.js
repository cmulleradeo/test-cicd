import Core from '@metric/acl-core'

import MilestoneKafkaToSql from './Milestone-kafka-to-sql'

new Core(
  [
    { plugin: MilestoneKafkaToSql, prefix: 'MILESTONE_KAFKA_TO_SQL' }
  ]
).setPlugins()
