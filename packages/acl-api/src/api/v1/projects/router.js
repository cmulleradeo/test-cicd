import { Router } from 'express'

import { transformQuery } from 'services/express/query/transform.middleware'
import { checkParams } from 'services/express/query/checkParams.middleware'
import { number } from 'services/express/query'
import * as Controller from './controller'

const router = Router()

router.get(
  '/ttm/:ttm',
  transformQuery({
    limit: number,
    offset: number
  }),
  checkParams,
  Controller.getProjectsByTTM
)
router.get(
  '/:projectCode',
  transformQuery({
    limit: number,
    offset: number
  }),
  checkParams,
  Controller.getProjectsByProjectCode
)
router.get(
  '/:projectCode/brief',
  transformQuery({
    limit: number,
    offset: number
  }),
  checkParams,
  Controller.getBriefByCode
)
router.get(
  '/:projectCode/brief/bu/:buLabel',
  transformQuery({
    limit: number,
    offset: number
  }),
  checkParams,
  Controller.getBriefByCodeAndBu
)
router.get(
  '/:projectCode/milestones',
  transformQuery({
    limit: number,
    offset: number
  }),
  checkParams,
  Controller.getMilestonesByProjectCode
)
export default router
