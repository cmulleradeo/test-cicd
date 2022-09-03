import { sqlModels } from '@metric/acl-common-modules'

import logger from 'services/loggers'
import sequelize from 'sequelize'

const Op = sequelize.Op
const {
  StyleModel,
  MerchSecondaryVersionModel,
  MerchProductVersionSecondariesModel,
  SpecDataSheetModel,
  ProductSymbolModel,
  SpecDataSheetRevisionModel,
  SpecSectionModel, ClassifierModel,
  SpecDataSheetItemModel,
  SpecSectionItemModel,
  SpecItemDefinitionModel,
  LookUpItemsModel
} = sqlModels

export const getProductsByMatrixId = async (req, res, next) => {
  const { matrixId } = req.params
  const { limit, offset } = req.query

  logger.debug(`>>>> Entering in getProductsByMatrixId(matrixId=${matrixId},offset=${offset},limit=${limit})`)

  try {
    const style = await StyleModel
      .getModel()
      .findOne({
        where: { matrixId },
        include: [{
          model: ProductSymbolModel.getModel(),
          attributes: ['brandId', 'brandName']
        }, {
          model: SpecDataSheetModel.getModel(),
          as: 'sds',
          include: [{
            model: SpecDataSheetRevisionModel.getModel(),
            include: [{
              model: SpecSectionModel.getModel(),
              as: 'ss'
            }, {
              model: SpecDataSheetItemModel.getModel(),
              include: [{
                model: SpecSectionItemModel.getModel(),
                as: 'ssi',
                include: [{
                  model: SpecItemDefinitionModel.getModel(),
                  as: 'sid'
                }]
              },
              {
                model: LookUpItemsModel.getModel(),
                as: 'ssiL'
              }]
            }]
          }]
        }, {
          model: ClassifierModel.getModel(),
          as: 'segment'
        }, {
          model: ClassifierModel.getModel(),
          as: 'styleClass'
        }, {
          model: ClassifierModel.getModel(),
          as: 'usage'
        }]
      })

    if (!style) {
      return res.status(404).json()
    }

    // temporaire family Id
    if (style.family) {
      style.family = {
        familyId: style?.family.split('-')[0].trim() || null,
        familyName: style?.family
      }
    } else {
      style.family = {
        familyId: null,
        familyName: null
      }
    }

    delete style.dataValues.id
    delete style.dataValues.specDataSheetId
    delete style.dataValues.parentGroupId
    delete style.dataValues.productType

    style.dataValues.brand = { brandId: style.dataValues.productSymbols[0]?.brandId || null, brandName: style.dataValues.productSymbols[0]?.brandName || null }
    delete style.dataValues.productSymbols

    style.dataValues.modelId = style.dataValues.sds?.specDataSheetRevision?.ss?.dataValues?.ModelStepId
    style.dataValues.modelName = style.dataValues.sds?.specDataSheetRevision?.ss?.dataValues?.ModelStepName

    style.dataValues.segmentName = style.dataValues?.segment?.nodeName || null
    style.dataValues.styleName = style.dataValues?.styleClass?.nodeName || null
    style.dataValues.usageName = style.dataValues?.usage?.nodeName || null
    delete style.dataValues.segment
    delete style.dataValues.styleClass
    delete style.dataValues.usage

    style.dataValues.modelAttributes = style.dataValues.sds?.specDataSheetRevision?.specDataSheetItems.map((element) => {
      return {
        attributeName: element?.dataValues?.ssi?.dataValues?.sid?.dataValues?.modelStepA || null,
        attributeId: element?.dataValues?.ssi?.dataValues?.sid?.dataValues?.attributes || null,
        valueName: element?.dataValues?.modelAttributeValu || null,
        valueId: element?.dataValues?.ssiL?.dataValues?.code || null
      }
    })
    delete style.dataValues.sds

    return res.status(200).json(style)
  } catch (err) {
    next(err)
  }
}

export const getProductsByMatrixIdAndBu = async (req, res, next) => {
  const { matrixId, buLabel } = req.params
  let bc

  logger.debug(`>>>> Entering in getProductsByMatrixIdAndBu(matrixId=${matrixId}, buLabel=${buLabel})`)

  try {
    const style = await StyleModel
      .getModel()
      .findOne({
        where: { matrixId }
      })

    if (!style) {
      return res.status(404).json()
    }

    // get table of secondaries
    const merchProductVersionRef = style.merchProductVersionId
    const secondaries = await MerchProductVersionSecondariesModel
      .getModel()
      .findAll({
        where: { merchProductVersionId: merchProductVersionRef }
      })
      .then((ids) => ids.map((id) => id.merchSecondaryVersionId))

    if (secondaries.length === 0) {
      return res.status(404).json()
    }

    // get the case where id is in secondaries, secondaryType is 'BU' and buLabel match to the label in url (case insensitive)
    const MSVmodel = await MerchSecondaryVersionModel
      .getModel()
      .findOne({
        where: { id: { [Op.in]: secondaries }, secondaryType: 'BU', buLabel: { [Op.iLike]: buLabel } }
      })
    if (!MSVmodel) {
      return res.status(404).json()
    }

    // get all the data for all business conditions
    bc = await MerchSecondaryVersionModel
      .getModel()
      .findOne({
        attributes: ['buId', 'currentNewProduction', 'currentRefBU', 'gtin', 'gtinSecondary',
          'comment', 'expected3xNetBuyPriceStore', 'expectedBusinessWarrantyPersio', 'expectedMerchandising', 'expectedMoq', 'expectedRangeLetter', 'expectedSellPriceForCustomer',
          'freezeForecast', 'expectedDeveliveryPromiseOnline', 'expectedDeveliveryPromisePhysical', 'expectedImplementationDate', 'expectedForcastedSellingTO', 'expectedAnnualSelloutForecastQtity',
          'finalNbSampleRequest', 'finalNbSampleRequestShowRoom', 'freezeCommitment', 'gtinFinal', 'finalComitmentSellingTo', 'expectedAnnualSelloutComitment', 'expectedFirstImplementationQtity'
        ],
        where: { id: MSVmodel.id, buLabel: { [Op.iLike]: buLabel } }
      })

    // organize the 3 business in 3 objects
    const BusinessHistoricalConditions = {
      buId: bc.buId,
      currentNewProduction: bc.currentNewProduction,
      currentRefBU: bc.currentRefBU,
      gtin: bc.gtin,
      gtinSecondary: bc.gtinSecondary
    }
    const BusinessForecastConditions = {
      buId: bc.buId,
      comment: bc.comment,
      expected3xNetBuyPriceStore: bc.expected3xNetBuyPriceStore,
      expectedBusinessWarrantyPersio: bc.expectedBusinessWarrantyPersio,
      expectedMerchandising: bc.expectedMerchandising,
      expectedMoq: bc.expectedMoq,
      expectedRangeLetter: bc.expectedRangeLetter,
      expectedSellPriceForCustomer: bc.expectedSellPriceForCustomer,
      freezeForecast: bc.freezeForecast,
      expectedDeveliveryPromiseOnline: bc.expectedDeveliveryPromiseOnline,
      expectedDeveliveryPromisePhysical: bc.expectedDeveliveryPromisePhysical,
      expectedImplementationDate: bc.expectedImplementationDate,
      expectedForcastedSellingTO: bc.expectedForcastedSellingTO,
      expectedAnnualSelloutForecastQtity: bc.expectedAnnualSelloutForecastQtity
    }
    const BusinessCommitmentConditions = {
      buId: bc.buId,
      finalNbSampleRequest: bc.finalNbSampleRequest,
      finalNbSampleRequestShowRoom: bc.finalNbSampleRequestShowRoom,
      freezeCommitment: bc.freezeCommitment,
      gtinFinal: bc.gtinFinal,
      finalComitmentSellingTo: bc.finalComitmentSellingTo,
      expectedAnnualSelloutComitment: bc.expectedAnnualSelloutComitment,
      expectedFirstImplementationQtity: bc.expectedFirstImplementationQtity
    }

    const businessConditions = { BusinessHistoricalConditions, BusinessForecastConditions, BusinessCommitmentConditions }

    res.status(200).json({
      businessConditions
    })
  } catch (err) {
    next(err)
  }
}
