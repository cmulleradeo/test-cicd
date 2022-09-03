import { Router } from 'express'

import { transformQuery } from 'services/express/query/transform.middleware'
import { checkParams } from 'services/express/query/checkParams.middleware'
import { number } from 'services/express/query'
import * as Controller from './controller'

const router = Router()

router.get(
  '/:matrixId',
  transformQuery({
    limit: number,
    offset: number
  }),
  checkParams,
  Controller.getProductsByMatrixId
)

router.get(
  '/:matrixId/bu/:buLabel',
  transformQuery({
    limit: number,
    offset: number
  }),
  checkParams,
  Controller.getProductsByMatrixIdAndBu
)

export default router
