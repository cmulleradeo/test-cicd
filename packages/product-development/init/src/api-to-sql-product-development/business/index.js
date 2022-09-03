import { SqlHelper, sqlModels, mappers } from '@metric/acl-common-modules'
import { MetricApiHelper, MetricApiEndpoints } from '@metric/acl-init-modules'

const {
  ClassifierModel,
  ProductSymbolModel,
  SpecDataSheetModel,
  SpecDataSheetItemModel,
  SpecDataSheetRevisionModel,
  SpecDataSheetRevisionItemModel,
  SpecItemDefinitionModel,
  SpecSectionModel,
  SpecSectionItemModel,
  StyleBrandModel,
  StyleModel,
  LookUpItemsModel,
  dropSqlConstraintsAndIndexes
} = sqlModels

const {
  ClassifierMapper,
  ProductSymbolMapper,
  SpecDataSheetMapper,
  SpecDataSheetItemMapper,
  SpecDataSheetRevisionMapper,
  SpecItemDefinitionMapper,
  SpecSectionMapper,
  SpecSectionItemMapper,
  StyleMapper,
  LookUpItemsMapper
} = mappers

class Business {
  constructor (logger, logInfos, config, { SQL, ErrorHandler }) {
    this.logInfos = logInfos
    this.config = config
    this.logger = logger
    this.sql = SQL
    this.errorHandler = ErrorHandler

    this.api = new MetricApiHelper(logger, logInfos, config, ErrorHandler)
    this.SqlHelper = new SqlHelper(config, logger, logInfos)
  }

  init = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.init()`, this.logInfos)
    const postgreOptions = {}
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this.config.SQL_USE_SSL) {
      postgreOptions.dialectOptions = {
        ssl: {
          require: this.config.SQL_USE_SSL,
          rejectUnauthorized: false
        },
        keepAlive: true
      }
    }
    await this.sql.connectToDatabase(this.logInfos, postgreOptions)

    await dropSqlConstraintsAndIndexes(this.sql.getSequelizeInstance(this.logInfos))

    this.classifierModel = ClassifierModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.productSymbolModel = ProductSymbolModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.specDataSheetModel = SpecDataSheetModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.specDataSheetItemModel = SpecDataSheetItemModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.specDataSheetRevisionModel = SpecDataSheetRevisionModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.specDataSheetRevisionItemModel = SpecDataSheetRevisionItemModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.specItemDefinitionModel = SpecItemDefinitionModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.specSectionModel = SpecSectionModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.specSectionItemModel = SpecSectionItemModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.styleModel = StyleModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.styleBrandModel = StyleBrandModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    this.lookUpItemsModel = LookUpItemsModel.bootstrapModel(this.sql.getSequelizeInstance(this.logInfos), this.sql.DataTypes)
    await this.sql.synchronizeAllModels(this.logInfos, true)

    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.init()`, this.logInfos)
  }

  getClassifiers = async () => {
    const { classifier3 } = await this.api.getAllClassifier3()
    const classifierMapper = new ClassifierMapper()
    try {
      await this.SqlHelper.upsertBatch(this.classifierModel, classifier3.map(classifierMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Classifier3: ${err.message}`)
    }
  }

  getProductSymbols = async () => {
    const { productSymbols } = await this.api.getAllProductSymbols()
    const productSymbolMapper = new ProductSymbolMapper()
    try {
      await this.SqlHelper.upsertBatch(this.productSymbolModel, productSymbols.map(productSymbolMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Product Symbol: ${err.message}`)
    }
  }

  getSpecDataSheets = async () => {
    const { specDataSheets } = await this.api.getAllSpecDataSheets()
    const specDataSheetMapper = new SpecDataSheetMapper()
    try {
      await this.SqlHelper.upsertBatch(this.specDataSheetModel, specDataSheets.map(specDataSheetMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Specification Data Sheet: ${err.message}`)
    }
  }

  getSpecDataSheetItems = async () => {
    const limit = 10000
    let skip = 0
    let apiResponse
    const specDataSheetItemMapper = new SpecDataSheetItemMapper()

    do {
      apiResponse = await this.api.getData(MetricApiEndpoints.specification_data_sheet_items, skip, limit)
      try {
        await this.SqlHelper.upsertBatch(this.specDataSheetItemModel, apiResponse.data.map(specDataSheetItemMapper.convertApiToAclData))
      } catch (err) {
        throw new Error(`Failed to insert the Specification Data Sheet Item: ${err.message}`)
      }

      skip += limit
    } while (!apiResponse.allDataReturned)
  }

  getSpecDataSheetRevisions = async () => {
    const { specDataSheetRevisions } = await this.api.getAllSpecDataSheetRevisions()
    const specDataSheetRevisionMapper = new SpecDataSheetRevisionMapper()
    try {
      await this.SqlHelper.upsertBatch(this.specDataSheetRevisionModel, specDataSheetRevisions.map(specDataSheetRevisionMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Specification Data Sheet Revision: ${err.message}`)
    }

    const revisionItems = []
    specDataSheetRevisions.forEach((revision) => {
      if (revision.items.length && revision.items.length > 0) {
        revision.items.forEach((item) => {
          revisionItems.push({
            specDataSheetRevisionId: revision.$id,
            specDataSheetItemId: item
          })
        })
      }
    })
    try {
      await this.SqlHelper.upsertBatch(this.specDataSheetRevisionItemModel, revisionItems)
    } catch (err) {
      throw new Error(`Failed to insert the Specification Data Sheet Revision Item: ${err.message}`)
    }
  }

  getSpecItemDefinitions = async () => {
    const { specItemDefinitions } = await this.api.getAllSpecSectionItemDefinitions()
    const specItemDefinitionMapper = new SpecItemDefinitionMapper()
    try {
      await this.SqlHelper.upsertBatch(this.specItemDefinitionModel, specItemDefinitions.map(specItemDefinitionMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Specification Item Definition: ${err.message}`)
    }
  }

  getSpecSectionItems = async () => {
    const { specSectionItems } = await this.api.getAllSpecSectionItems(10000)
    const specSectionItemMapper = new SpecSectionItemMapper()
    try {
      await this.SqlHelper.upsertBatch(this.specSectionItemModel, specSectionItems.map(specSectionItemMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Specification Section Item: ${err.message}`)
    }
  }

  getSpecSections = async () => {
    const { specSections } = await this.api.getAllSpecSections()
    const specSectionMapper = new SpecSectionMapper()
    try {
      await this.SqlHelper.upsertBatch(this.specSectionModel, specSections.map(specSectionMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Specification Section: ${err.message}`)
    }
  }

  getStyles = async () => {
    const limit = 1000
    let skip = 0
    let apiResponse
    const styleMapper = new StyleMapper()

    do {
      apiResponse = await this.api.getData(MetricApiEndpoints.style, skip, limit)
      // filter on productStatus !== Deleted
      const styleResponse = apiResponse.data
        .filter((style) => style.adeo_style_product_status_enum !== 'ADEO_ProductStatus:Deleted' && style.adeo_style_product_status_enum !== 'ADEO_ProductStatus:Cancelled' && style.adeo_style_product_type_string === 'Product')
        .map(styleMapper.convertToAclData)
      try {
        await this.SqlHelper.upsertBatch(this.styleModel, styleResponse)
      } catch (err) {
        throw new Error(`Failed to insert the Style: ${err.message}`)
      }

      const styleBrands = []
      apiResponse.data
        .filter((style) => style.adeo_style_product_status_enum !== 'ADEO_ProductStatus:Deleted' && style.adeo_style_product_status_enum !== 'ADEO_ProductStatus:Cancelled' && style.adeo_style_product_type_string === 'Product')
        .forEach((style) => {
          if (style.adeo_style_brand_ref.length && style.adeo_style_brand_ref.length > 0) {
            style.adeo_style_brand_ref.forEach((brand) => {
              styleBrands.push({
                styleId: style.$id,
                productSymbolId: brand
              })
            })
          }
        })
      try {
        await this.SqlHelper.upsertBatch(this.styleBrandModel, styleBrands)
      } catch (err) {
        throw new Error(`Failed to insert the Style Brand: ${err.message}`)
      }

      skip += limit
    } while (!apiResponse.allDataReturned)
  }

  getLookUpItems = async () => {
    const { lookUpItems } = await this.api.getAllLookUpItems()
    const lookUpItemsMapper = new LookUpItemsMapper()
    try {
      await this.SqlHelper.upsertBatch(this.lookUpItemsModel, lookUpItems.map(lookUpItemsMapper.convertApiToAclData))
    } catch (err) {
      throw new Error(`Failed to insert the Specification Section: ${err.message}`)
    }
  }

  getBusinessTerm = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.Business.getBusinessTerm()`, this.logInfos)

    await Promise.all([
      this.getClassifiers(),
      this.getProductSymbols(),
      this.getSpecDataSheets(),
      this.getSpecDataSheetRevisions(),
      this.getSpecSections()
    ])

    await this.getSpecDataSheetItems()
    await this.getSpecSectionItems()
    await this.getSpecItemDefinitions()
    await this.getStyles()
    await this.getLookUpItems()

    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.Business.getBusinessTerm()`, this.logInfos)
  }
}

export default Business
