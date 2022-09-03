import { transform } from './index'

export const transformQuery = (schema, options) => (req, res, next) => {
  req.query = transform(req.query, schema, options)
  next()
}
