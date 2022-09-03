import { Router } from 'express'

const router = new Router()

const path = '/healthcheck'

/**
 * request health check in core services.
 *
 * @param {string} path specific url path.
 * @param {Function} callback request health check and return only the used one.
 */
router.get(path, async (req, res) => {
  res.json('OK')
})

export default { router }
