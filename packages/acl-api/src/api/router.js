import { Router } from 'express'

import v1Router from './v1/router'
import healthRouter from './health/router'

const router = new Router()

router.use('/v1', v1Router)
router.use('/health', healthRouter)

export default router
