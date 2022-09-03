import winston from 'winston'
import expressWinston from 'express-winston'

import { transportsList } from './index'

export default (app) => {
  app.use(expressWinston.logger({
    transports: transportsList,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false,
    ignoreRoute: (req, res) => {
      return req.url === '/api/health'
    }
  }))
}
