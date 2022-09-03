import Core from '@metric/acl-core'

import BusinessEvent from './business-event-kafka'

new Core(
  [
    { plugin: BusinessEvent, prefix: 'BUSINESS_EVENT_KAFKA' }
  ]
).setPlugins()
