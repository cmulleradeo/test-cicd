import { Router } from 'express'

import * as Controller from './controller'

const router = new Router()

router.get(
  '/',
  Controller.getApiHealth
)

export default router
