import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'source-map-support/register'

import http from 'http'
import chalk from 'chalk'
import express from 'express'
import tracer from 'dd-trace'

import { generateLogInfos } from '@metric/acl-common-modules'

import bootstrapExpress from 'services/express/bootstrap'
import bootstrapPostgres from 'services/postgres/bootstrap'
import boostrapLogger from 'services/loggers/bootstrap'
import boostrapSwagger from 'services/swagger/bootstrap'
import config from './config/env'
import logger from './services/loggers'

// Init the DataDog tracer using the default env variables.
tracer.init()

/* eslint-disable arrow-parens */
const listenPromise = server => port => new Promise((resolve, reject) => {
  const listener = server.listen(port, err => (err ? reject(err) : resolve(listener)))
})
/* eslint-disable arrow-parens */

/**
 * @description Start Server.
 */
async function main () {
  try {
    const app = express()
    boostrapLogger(app)

    logger.info('Bootstrapping server.')

    await Promise.all([
      bootstrapExpress(app),
      bootstrapPostgres(),
      boostrapSwagger(app)
    ])

    const server = http.createServer(app)
    const listener = await listenPromise(server)(config.server.port)

    logger.info(chalk`Listening on port ${listener.address().port} in ${app.get('env')} environment.`)
  } catch (err) {
    logger.error(`Failed to bootstrap the server: ${err.message}`, generateLogInfos(null, null, err))
    process.exit(1)
  }
}

main()
