/* istanbul ignore next */
import express from 'express'

import healthcheck from './routers/healthcheck'
import Logger from '../services/Logger/index'

const app = express()
// It's recommended to not disclose technologies used on a website, with x-powered-by HTTP header (Sonar).
app.disable('x-powered-by')
const port = 8080

/**
 * @description function which start api listening.
 */
const start = function () {
  app.use(healthcheck.router)
  app.listen(port, function () {
    Logger.info(`Api deploy on port : ${port}`)
  })
}

export default {
  start
}
