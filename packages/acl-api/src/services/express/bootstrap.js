import bodyParser from 'body-parser'
import helmet from 'helmet'

import router from 'api/router'
import { errorHandler } from './errors'

export default (app) => {
  // Helmet sets some default HTTP headers to secure the app.
  app.use(helmet())

  // Number of spaces when replying with res.json().
  app.set('json spaces, 2')

  // Parsing of application/json.
  app.use(bodyParser.json({ extended: true, limit: 1024 * 1024 }))

  // Parsing of application/x-www-form-urlencoded.
  app.use(bodyParser.urlencoded({ extended: true }))

  // Api routes.
  app.use('/api', router)

  // Fallthrough error handler.
  app.use(errorHandler)
}
