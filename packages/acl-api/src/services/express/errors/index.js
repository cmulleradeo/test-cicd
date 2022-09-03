import loggers from 'services/loggers'
import { generateLogInfos } from '@metric/acl-common-modules'

export const symbol = Symbol('error')

export const errorCreator = (type, errorCode) => (message, more) => {
  const error = new Error(message || '')
  // eslint-disable-next-line security/detect-object-injection
  error[symbol] = true
  error.type = type
  error.code = errorCode
  error.more = more
  return error
}

export const ERRORS = {
  BAD_REQUEST: errorCreator('BAD_REQUEST', 400),
  FORBIDDEN: errorCreator('FORBIDDEN', 403),
  NOT_FOUND: errorCreator('NOT_FOUND', 404),
  UNPROCESSABLE_ENTITY: errorCreator('UNPROCESSABLE_ENTITY', 422),
  RANGE_NOT_SATISFIABLE: errorCreator('RANGE_NOT_SATISFIABLE', 416)
}

// As it is a error handler, I need to specify 4 arguments even if I don't use the last one.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line security/detect-object-injection
  if (err[symbol]) {
    return res.status(err.code)
      .json({
        // eslint-disable-next-line no-undefined
        message: err.message || undefined,
        code: err.code,
        type: err.type,
        more: err.more
      })
  }

  loggers.error(err.message, generateLogInfos(null, null, err))
  res.status(500).send()
}
