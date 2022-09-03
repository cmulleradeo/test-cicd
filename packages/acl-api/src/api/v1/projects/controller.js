import { sqlModels } from '@metric/acl-common-modules'

import logger from 'services/loggers'
import { formatResponse } from 'utils/serverUtils'
import { ERRORS } from 'services/express/errors'
import sequelize from 'sequelize'

import { includeUsers, includeMerchCollectionVersions } from './sqlIncludes'

const Op = sequelize.Op

const {
  StyleModel,
  CollectionModel,
  UserModel,
  RoleModel,
  MerchCollectionVersionSecondariesModel,
  MerchSecondaryVersionModel,
  SpecSectionModel,
  CalendarActivitiesModel,
  ActivityModel
} = sqlModels

export const getProjectsByTTM = async (req, res, next) => {
  const { ttm } = req.params
  let { limit, offset } = req.query
  if (limit == null) { limit = 20 }
  if (offset == null) { offset = 0 }
  logger.debug(`>>>> Entering in getProjectsByTTM(ttm=${ttm},offset=${offset},limit=${limit})`)
  try {
    const { count, rows } = await CollectionModel
      .getModel()
      .findAndCountAll({
        where: { ttm },
        offset,
        limit
      })

    if (offset > count) throw ERRORS.RANGE_NOT_SATISFIABLE('Range not satisfiable: offset out of bound')

    formatResponse(res, count, rows.map((element) => element.projectCode), offset, limit)
  } catch (err) {
    next(err)
  }
}

export const getProjectsByProjectCode = async (req, res, next) => {
  const { projectCode } = req.params
  const { limit, offset } = req.query

  logger.debug(`>>>> Entering in getProjectsByProjectCode(projectCode=${projectCode},offset=${offset},limit=${limit})`)

  try {
    const ppd = await CollectionModel
      .getModel()
      .findOne({
        attributes: ['ttm', 'projectCode', 'projectName', 'projectInitialCode', ['category1Value', 'Market'], ['category2Value', 'Departement'],
          'projectMdhScope', 'projectScope', 'projectQualification', 'projectLifeTime'],
        where: { projectCode },
        offset,
        limit
      })
    if (ppd !== null) {
      const matrixIdList = await StyleModel
        .getModel()
        .findAll({
          attributes: ['matrixId'],
          where: { projectName: projectCode },
          offset,
          limit
        })

      delete ppd.dataValues.projectType
      res.status(200).json({
        ...ppd.toJSON(),
        matrixIdList: matrixIdList.map((element) => element.matrixId)
      })
    } else { res.status(404).json() }
  } catch
  (err) {
    next(err)
  }
}

export const getBriefByCode = async (req, res, next) => {
  const { projectCode } = req.params

  logger.debug(`>>>> Entering in getProjectsByProjectCode(projectCode=${projectCode})`)

  try {
    const collection = await CollectionModel
      .getModel()
      .findOne({
        where: { projectCode },
        attributes: {
          exclude: ['id', 'ttm', 'projectName', 'projectType', 'projectInitialCode', 'category1Id', 'category1Value', 'category2Id', 'category2Value',
            'projectScope', 'projectQualification', 'projectLifeTime', 'projectStatus', 'projectMdhScope', 'teamQualityPqmId',
            'merchCollectionId', 'teamQualityContinuousImprovementId', 'teamPurchaseSupplyScoId', 'teamPurchaseSupplyRafId', 'teamPurchaseSupplyPlId',
            'teamPurchaseSourcingManagerId', 'teamPurchaseIndustrializationManagerId', 'teamProductRcpId', 'teamProductPcmId',
            'teamProductNoticeManagerId', 'teamProductMlId', 'teamProductLuiId', 'teamProductDlId', 'teamProductClId', 'teamProductCcpId',
            'teamProductBusinessSerialLifeManagerId', 'teamIndustryPackId', 'teamIndustryIndustrialDrawerId', 'teamIndustryIndustrialBuyerId',
            'teamIndustryIlId', 'teamIndustryDesignId', 'teamIndustryConceptionEngineerId', 'teamBuCpLeaderId', 'teamBuCoLeader2Id',
            'teamBuCoLeader1Id', 'categoryManagerCmId', 'CP9LmRuId', 'CP7LmBrId', 'CP6LmPlId', 'CP5LmItId', 'CP53LmZaId',
            'CP3LmPtId', 'CP38ZodioBrId', 'CP2LmEsId', 'CP26LmRoId', 'CP23LmUaId', 'CP22BricomanItId', 'CP21ZodioFrId',
            'CP20BricomanPlId', 'CP1LmFrId', 'CP19LmGrCyId', 'CP18BricomartId', 'CP17WeldomSerId', 'CP14BricomanFrId', 'CP10BricoCenterId']
        },
        required: false,
        include: [
          {
            model: SpecSectionModel.getModel(),
            as: 'models',
            through: {
              attributes: []
            },
            attributes: ['ModelStepId', 'ModelStepName']
          },
          ...includeUsers(),
          includeMerchCollectionVersions()
        ]
      })

    if (!collection) {
      return res.status(404).json()
    }

    // Move the child element mcv for MerchCollectionVersion to the root of the brief object.
    const brief = Object.assign({}, collection.dataValues, collection.dataValues?.mcv?.dataValues)
    delete brief.mcv

    brief.ressources = brief.ressources?.map((element) => {
      return {
        secondaryType: element.secondaryType,
        nodeName: element.msp?.nodeName,
        secondaryVersion: {
          resourceCategory: element.resourceCategory,
          oVorResourceY: element.oVorResourceY,
          oVorResourceY1: element.oVorResourceY1,
          oVorResourceY2: element.oVorResourceY2,
          oVorResourceY3: element.oVorResourceY3,
          resourceTotalDays: element.resourceTotalDays,
          totalCost: element.totalCost
        }
      }
    })

    brief.offices = brief.offices?.map((element) => {
      return {
        secondaryType: element.secondaryType,
        nodeName: element.msp?.nodeName,
        secondaryVersion: {
          officeChallenger: element.officeChallenger,
          officeLeader: element.officeLeader
        }
      }
    })

    brief.overheads = brief.overheads?.map((element) => {
      return {
        secondaryType: element.secondaryType,
        nodeName: element.msp?.nodeName,
        secondaryVersion: {
          whosIn: element.whosIn,
          oVorResourceY: element.oVorResourceY,
          oVorResourceY1: element.oVorResourceY1,
          oVorResourceY2: element.oVorResourceY2,
          oVorResourceY3: element.oVorResourceY3,
          totalCost: element.totalCost
        }
      }
    })

    res.status(200).json(brief)
  } catch (err) {
    next(err)
  }
}

export const getBriefByCodeAndBu = async (req, res, next) => {
  const { projectCode, buLabel } = req.params

  logger.debug(`>>>> Entering in getBriefByCodeAndBu(projectCode=${projectCode}, buLabel=${buLabel})`)

  try {
    const collection = await CollectionModel
      .getModel()
      .findOne({
        where: { projectCode }
      })

    if (!collection) {
      return res.status(404).json()
    }
    const merchcollectionVersionRef = collection.merchCollectionId
    const secondaries = await MerchCollectionVersionSecondariesModel
      .getModel()
      .findAll({
        where: { merchCollectionVersionId: merchcollectionVersionRef }
      })
      .then((ids) => ids.map((id) => id.merchSecondaryVersionId))

    if (secondaries.length === 0) {
      return res.status(404).json()
    }

    const MSVmodel = await MerchSecondaryVersionModel
      .getModel()
      .findOne({
        where: { id: { [Op.in]: secondaries }, secondaryType: 'BU', buLabel: { [Op.iLike]: buLabel } }
      })
    if (!MSVmodel) {
      return res.status(404).json()
    }

    const briefBu = await MerchSecondaryVersionModel
      .getModel()
      .findOne({
        attributes: ['briefBUInhabitantAvailabilityDate', 'briefBUTakingBackFormerRangeStock', 'briefBURebateFormerRange', 'briefBUMerchImplementation', 'briefBUImplementationEstimatedCost',
          'briefBUImplementationFinancialHelp', 'BUName', 'briefBUTurnoverExistingParameter', 'briefBUProjectSalesPerStore', 'briefBUTurnoverProjectProjections',
          'briefBUNumberOfMatrixID', 'briefBUNumberOfMatrixIDI2', 'briefBUNumberOfMatrixIDI1', 'briefBUMarketShareProjectFamilySalesRate', 'briefBUMarginRateEstimated3xNet',
          'briefBUPurchasingGainFirstPrice', 'briefBUPurchasingGainFirstPriceRate', 'briefBUPurchasingGain', 'briefBUPurchasingAmount', 'briefBU3xNetMarginNewProductsRate', 'briefBU3xNetMarginNewProductsValidatedRate',
          'briefBUSellingTurnoverFullYeatCommitments', 'briefBUPurchasingGainValidatedRate', 'briefBUPurchasingGainValidated', 'briefBUPurchasingAmountValidated', 'briefBUNumberOfMatrixIdCommitment',
          'briefBUNumberOfMatrixIdI2Commitment', 'briefBUNumberOfMatrixIdI1Commitment', 'BriefBUNumberOfShops'],
        where: { id: MSVmodel.id, buLabel: { [Op.iLike]: buLabel } }
      })

    res.status(200).json({
      // eslint-disable-next-line no-undef
      ...briefBu.toJSON()
    })
  } catch (err) {
    next(err)
  }
}

export const getMilestonesByProjectCode = async (req, res, next) => {
  const { projectCode } = req.params
  const Milestones = []
  const Deliverables = []
  logger.debug(`>>>> Entering in getMilestonesByProjectCode(projectCode=${projectCode})`)

  try {
    const collection = await CollectionModel
      .getModel()
      .findAll({
        attributes: ['projectCode'],
        where: { projectCode },
        include: [{
          model: CalendarActivitiesModel.getModel(),
          required: true,
          include: [{
            model: ActivityModel.getModel(),
            where: { [Op.or]: [{ stepType: 'Deliverable' }, { stepType: 'Milestone' }] },
            attributes: ['index', 'name', 'details', 'initialDate', 'revisedDate', 'completionDate', 'stepStatus', 'stepType', 'referenceMilestone', 'essentialDeliverable', 'deliverableType', 'deliverableStatus'],
            required: true,
            raw: true,
            include: [{
              model: UserModel.getModel(),
              attributes: ['name']
            },
            {
              model: RoleModel.getModel(),
              attributes: ['name']
            }]
          }]
        }]
      })

    if (collection.length === 0) {
      return res.status(404).json()
    }
    const calendarActivities = collection[0].dataValues.calendarActivities

    for (const activity of calendarActivities) {
      if (activity.dataValues.activity.dataValues.stepType === 'Deliverable') {
        const deliverable = {}
        deliverable.index = activity.dataValues.activity.dataValues.index
        deliverable.DeliverableAccountableUser = activity.dataValues.activity.dataValues.user.dataValues?.name || null
        deliverable.DeliverableAccountableRole = activity.dataValues.activity.dataValues.role.dataValues?.name || null
        deliverable.DeliverableName = activity.dataValues.activity.dataValues?.name
        deliverable.DeliverableDetails = activity.dataValues.activity.dataValues?.details
        deliverable.DeliverableInitialDate = activity.dataValues.activity.dataValues?.initialDate
        deliverable.DeliverableRevisedDate = activity.dataValues.activity.dataValues?.revisedDate
        deliverable.DeliverableExecutionDate = activity.dataValues.activity.dataValues?.completionDate
        deliverable.StepStatus = activity.dataValues.activity.dataValues?.stepStatus
        deliverable.MilestoneReference = activity.dataValues.activity.dataValues?.referenceMilestone
        deliverable.StepType = activity.dataValues.activity.dataValues?.stepType
        deliverable.EssentialDeliverable = activity.dataValues.activity.dataValues?.essentialDeliverable
        deliverable.DeliverableType = activity.dataValues.activity.dataValues?.deliverableType
        deliverable.DeliverableStatus = activity.dataValues.activity.dataValues?.deliverableStatus
        Deliverables.push(deliverable)
      }
      if (activity.dataValues.activity.dataValues.stepType === 'Milestone') {
        const milestone = {}
        milestone.index = activity.dataValues.activity.dataValues.index
        milestone.MilestoneAccountableUser = activity.dataValues.activity.dataValues.user.dataValues?.name || null
        milestone.MilestoneAccountableRole = activity.dataValues.activity.dataValues.role.dataValues?.name || null
        milestone.MilestoneName = activity.dataValues.activity.dataValues?.name
        milestone.MilestoneDetails = activity.dataValues.activity.dataValues?.details
        milestone.MilestoneInitialDate = activity.dataValues.activity.dataValues?.initialDate
        milestone.MilestoneRevisedDate = activity.dataValues.activity.dataValues?.revisedDate
        milestone.MilestoneExecutionDate = activity.dataValues.activity.dataValues?.completionDate
        milestone.StepStatus = activity.dataValues.activity.dataValues?.stepStatus
        milestone.MilestoneReference = activity.dataValues.activity.dataValues?.referenceMilestone
        milestone.StepType = activity.dataValues.activity.dataValues?.stepType
        Milestones.push(milestone)
      }
    }

    Milestones.sort(function compare (a, b) {
      if (a.index < b.index) { return -1 }
      if (a.index > b.index) { return 1 }
      return 0
    })
    Deliverables.sort(function compare (a, b) {
      if (a.index < b.index) { return -1 }
      if (a.index > b.index) { return 1 }
      return 0
    })

    Milestones.forEach((a) => {
      const deliverables = []
      Deliverables.forEach((b) => {
        if (a.MilestoneReference === b.MilestoneReference) {
          delete b.index
          deliverables.push(b)
        }
      })
      delete a.index
      a.Deliverables = deliverables || null
    })
    res.status(200).json(
      Milestones
    )
  } catch (err) {
    next(err)
  }
}
