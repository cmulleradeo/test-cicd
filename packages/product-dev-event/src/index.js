import Core from '@metric/acl-core'

import ProductEvent from './product-dev-event-kafka'

new Core(
  [
    { plugin: ProductEvent, prefix: 'PRODUCT_EVENT_KAFKA' }
  ]
).setPlugins()
