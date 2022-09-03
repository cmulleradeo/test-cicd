import { ERRORS } from '../errors/index'

export const checkParams = (req, res, next) => {
  const { limit, offset } = req.query

  if (Number.isNaN(limit)) throw ERRORS.BAD_REQUEST('Invalid parameter: limit')

  if (Number.isNaN(offset)) throw ERRORS.BAD_REQUEST('Invalid parameter: limit')

  if (limit && (limit < 0)) throw ERRORS.BAD_REQUEST('Invalid parameter: limit')

  if (offset && (offset < 0)) throw ERRORS.BAD_REQUEST('Invalid parameter: offset')

  next()
}
