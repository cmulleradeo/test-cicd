import { Router } from 'express'

import projectRouter from './projects/router'
import productRouter from './products/router'

const router = new Router()

router.use('/projects', projectRouter)
router.use('/productDevelopment', productRouter)

router.use((req, res, next) => {
  res.status(404).send('page not found')
})

export default router
