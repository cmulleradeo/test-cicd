import util from 'util'
import {
  generateLogInfos,
  constants,
  mappers,
  sqlModels,
  SqlHelper
} from '@metric/acl-common-modules'
import sequelize from 'sequelize'
const { domains } = constants
const {
  SpecItemDefinitionModel,
  SpecSectionItemModel,
  SpecDataSheetModel,
  ClassifierModel,
  SpecSectionModel,
  StyleModel,
  ProductSymbolModel,
  SpecDataSheetItemModel,
  SpecDataSheetRevisionModel,
  StyleBrandModel,
  SpecDataSheetRevisionItemModel,
  LookUpItemsModel
} = sqlModels
const Op = sequelize.Op
export default class Business {
  constructor (coreServices, pluginInfos, config) {
    this.pluginInfos = pluginInfos
    this.config = config

    this.logInfos = {
      feature: 'api_to_sql-product-development-',
      stream: config.STREAM,
      labels: {
        plugin: config.PLUGIN_NAME
      }
    }

    this.sql = coreServices.SQL
    this.logger = coreServices.Logger
    this.SqlHelper = new SqlHelper(config, this.logger, this.logInfos)
    this.kafkaProducer = coreServices.KafkaProducer

    this.SpecItemDefinitionMapper = new mappers.SpecItemDefinitionMapper()
    this.SpecSectionItemMapper = new mappers.SpecSectionItemMapper()
    this.SpecDataSheetMapper = new mappers.SpecDataSheetMapper()
    this.ClassifierMapper = new mappers.ClassifierMapper()
    this.SpecSectionMapper = new mappers.SpecSectionMapper()
    this.StyleMapper = new mappers.StyleMapper()
    this.ProductSymbolMapper = new mappers.ProductSymbolMapper()
    this.SpecDataSheetItemMapper = new mappers.SpecDataSheetItemMapper()
    this.SpecDataSheetRevisionMapper = new mappers.SpecDataSheetRevisionMapper()
    this.LookUpItemsMapper = new mappers.LookUpItemsMapper()
  }

  /**
   * Initialize the database connection and models.
   */
  init = async () => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.initDatabase()`, generateLogInfos(this.pluginInfos))
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
    await this.sql.connectToDatabase(this.pluginInfos, postgreOptions)

    this.SpecItemDefinitionModel = SpecItemDefinitionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.SpecSectionItemModel = SpecSectionItemModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.SpecDataSheetModel = SpecDataSheetModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.ClassifierModel = ClassifierModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.SpecSectionModel = SpecSectionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.StyleModel = StyleModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.ProductSymbolModel = ProductSymbolModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.SpecDataSheetItemModel = SpecDataSheetItemModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.SpecDataSheetRevisionModel = SpecDataSheetRevisionModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.StyleBrandModel = StyleBrandModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.SpecDataSheetRevisionItemModel = SpecDataSheetRevisionItemModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    this.LookUpItemsModel = LookUpItemsModel.bootstrapModel(
      this.sql.getSequelizeInstance(this.pluginInfos),
      this.sql.DataTypes
    )

    await this.sql.synchronizeAllModels(this.pluginInfos)

    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.initDatabase()`, generateLogInfos(this.pluginInfos))
  }

  /**
   * Process the message concerning BusinessForecastConditions received from Kafka.
   *
   * @param {object} productDevelopment The new attributes to update.
   * @param {number} productDevelopment.id Identifier of the entity to update.
   * @param {number} productDevelopment.operation Type of operation (INSERT, UPDATE, DELETE).
   * @param {object[]} productDevelopment.attributes Array containing the modifier attributes.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  processProductDevelopment = async (productDevelopment, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.processProductDevelopment(productDevelopment=${productDevelopment})`, generateLogInfos(this.pluginInfos))
    if (!productDevelopment) {
      throw new Error('ProjectProductDevelopment message is null')
    }

    if (typeof (productDevelopment) === 'string') {
      productDevelopment = JSON.parse(productDevelopment)
    }
    const logLabels = generateLogInfos(this.pluginInfos)
    switch (productDevelopment.operation) {
      case constants.rabbitMqOperations.insert:
        await this.insertProductDevelopment(productDevelopment, messageKey)
        break
      case constants.rabbitMqOperations.update:
        await this.updateproductDevelopment(productDevelopment, messageKey)
        break
      case constants.rabbitMqOperations.delete:
        await this.deleteProductDevelopment(productDevelopment.id, messageKey)
        break
      default:
        logLabels.labels.message = JSON.stringify(productDevelopment)
        this.logger.warn(`Received a message with an unexpected operation: ${productDevelopment.operation}`, logLabels)
        break
    }
    await this.sendProductDevelopmentToKafka(productDevelopment, messageKey)
    this.logger.debug(`<<<< Exiting in ${this.config.PLUGIN_NAME}.processProductDevelopment()`, generateLogInfos(this.pluginInfos))
  }

  sendProductDevelopmentToKafka = async (productDevelopment, messageKey) => {
    let message
    let productSymbol
    let styleBrand
    let specDataSheet
    let specDataSheetRevision
    let specSection
    let specDataSheetItem
    let specDataSheetRevisionItem
    let specSectionItem
    let specItemDefinition
    let classifier
    switch (messageKey) {
      case 'Style':
        try {
          message = await this.StyleModel.findOne({
            where: { id: productDevelopment.id }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in Style case')
        }
        break
      case 'ProductSymbol':
        try {
          productSymbol = await this.ProductSymbolModel.findOne({
            where: { id: productDevelopment.id }
          })
          styleBrand = await this.StyleBrandModel.findOne({
            where: { productSymbolId: productSymbol.id }
          })
          message = await this.StyleModel.findOne({
            where: { id: styleBrand.styleId }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in ProductSymbol case')
        }
        break
      case 'SpecificationDataSheet':
        try {
          specDataSheet = await this.SpecDataSheetModel.findOne({
            where: { id: productDevelopment.id }
          })
          message = await this.StyleModel.findOne({
            where: { specDataSheetId: specDataSheet.dataValues.id }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in SpecificationDataSheet case')
        }
        break
      case 'SpecificationDataSheetRevision':
        try {
          specDataSheetRevision = await this.SpecDataSheetRevisionModel.findOne({
            where: { id: '7901972' }
          })
          specDataSheet = await this.SpecDataSheetModel.findOne({
            where: { currentRevisionId: specDataSheetRevision.dataValues.id }
          })
          message = await this.StyleModel.findOne({
            where: { specDataSheetId: specDataSheet.dataValues.id }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in SpecificationDataSheetRevision case')
        }
        break
      case 'SpecificationSection':
        try {
          specSection = await this.SpecSectionModel.findOne({
            where: { id: productDevelopment.id }
          })
          specDataSheetRevision = await this.SpecDataSheetRevisionModel.findOne({
            where: { specificationSectionId: specSection.dataValues.id }
          })
          specDataSheet = await this.SpecDataSheetModel.findOne({
            where: { currentRevisionId: specDataSheetRevision.dataValues.id }
          })
          message = await this.StyleModel.findOne({
            where: { specDataSheetId: specDataSheet.dataValues.id }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in SpecificationSection case')
        }
        break
      case 'SpecificationDataSheetItem':
        try {
          specDataSheetItem = await this.SpecDataSheetItemModel.findOne({
            where: { id: productDevelopment.id }
          })
          specDataSheetRevisionItem = await this.SpecDataSheetRevisionItemModel.findOne({
            where: { specDataSheetItemId: specDataSheetItem.dataValues.id }
          })
          specDataSheetRevision = await this.SpecDataSheetRevisionModel.findOne({
            where: { id: specDataSheetRevisionItem.dataValues.specDataSheetRevisionId }
          })
          specDataSheet = await this.SpecDataSheetModel.findOne({
            where: { currentRevisionId: specDataSheetRevision.dataValues.id }
          })
          message = await this.StyleModel.findOne({
            where: { specDataSheetId: specDataSheet.dataValues.id }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in SpecificationDataSheetItem case')
        }
        break
      case 'SpecificationSectionItem':
        try {
          specSectionItem = await this.SpecSectionItemModel.findOne({
            where: { id: productDevelopment.id }
          })
          specDataSheetItem = await this.SpecDataSheetItemModel.findOne({
            where: { specificationSectionItemId: specSectionItem.dataValues.id }
          })
          specDataSheetRevisionItem = await this.SpecDataSheetRevisionItemModel.findOne({
            where: { specDataSheetItemId: specDataSheetItem.dataValues.id }
          })
          specDataSheetRevision = await this.SpecDataSheetRevisionModel.findOne({
            where: { id: specDataSheetRevisionItem.dataValues.specDataSheetRevisionId }
          })
          specDataSheet = await this.SpecDataSheetModel.findOne({
            where: { currentRevisionId: specDataSheetRevision.dataValues.id }
          })
          message = await this.StyleModel.findOne({
            where: { specDataSheetId: specDataSheet.dataValues.id }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in SpecificationSectionItem case')
        }
        break
      case 'SpecificationItemDefinition':
        try {
          specItemDefinition = await this.SpecItemDefinitionModel.findOne({
            where: { id: productDevelopment.id }
          })
          specSectionItem = await this.SpecSectionItemModel.findOne({
            where: { specificationItemDefinitionId: specItemDefinition.dataValues.id }
          })
          specDataSheetItem = await this.SpecDataSheetItemModel.findOne({
            where: { specificationSectionItemId: specSectionItem.dataValues.id }
          })
          specDataSheetRevisionItem = await this.SpecDataSheetRevisionItemModel.findOne({
            where: { specDataSheetItemId: specDataSheetItem.dataValues.id }
          })
          specDataSheetRevision = await this.SpecDataSheetRevisionModel.findOne({
            where: { id: specDataSheetRevisionItem.dataValues.specDataSheetRevisionId }
          })
          specDataSheet = await this.SpecDataSheetModel.findOne({
            where: { currentRevisionId: specDataSheetRevision.dataValues.id }
          })
          message = await this.StyleModel.findOne({
            where: { specDataSheetId: specDataSheet.dataValues.id }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in SpecificationItemDefinition case')
        }
        break
      case 'Classifier':
        try {
          classifier = await this.ClassifierModel.findOne({
            where: { id: productDevelopment.id }
          })
          message = await this.StyleModel.findOne({
            where: {
              [Op.or]: [
                { segmentId: classifier.id },
                { styleId: classifier.id },
                { usageId: classifier.id }
              ]
            }
          })
          if (!message) {
            return this.logger.error('MatrixID null')
          }
        } catch {
          this.logger.error('Failed to find the matrixId in Classifier case')
        }
        break
      default:
        this.logger.error('Failed to find a key (default case)')
        break
    }
    if (typeof (message.dataValues) !== 'undefined') {
      const matrixIdData = { matrixId: message.dataValues.matrixId }
      const BT = { businessTerm: domains.productDevelopment }
      const kafkaMessage = {
        topic: this.config.PRODUCT_DEVELOPMENT_TOPIC,
        key: BT,
        messages: [matrixIdData]
      }
      await this.kafkaProducer.createProducer(this.pluginInfos)
      await this.kafkaProducer.sendMessageWithKey(kafkaMessage, this.pluginInfos)
    }
  }

  /**
   * Get the SQL model and the mapper specific to the received domain.
   *
   * @param {string} domain Domain from the received message.
   * @returns {object} The SQL model and the mapper.
   */
  getModelAndMapperForDomain = (domain) => {
    switch (domain) {
      case domains.specificationItemDefinition:
        return { model: this.SpecItemDefinitionModel, mapper: this.SpecItemDefinitionMapper }
      case domains.specificationSectionItem:
        return { model: this.SpecSectionItemModel, mapper: this.SpecSectionItemMapper }
      case domains.specificationDataSheet:
        return { model: this.SpecDataSheetModel, mapper: this.SpecDataSheetMapper }
      case domains.classifier:
        return { model: this.ClassifierModel, mapper: this.ClassifierMapper }
      case domains.specificationSection:
        return { model: this.SpecSectionModel, mapper: this.SpecSectionMapper }
      case domains.style:
        return { model: this.StyleModel, mapper: this.StyleMapper }
      case domains.productSymbol:
        return { model: this.ProductSymbolModel, mapper: this.ProductSymbolMapper }
      case domains.specificationDataSheetRevision:
        return { model: this.SpecDataSheetRevisionModel, mapper: this.SpecDataSheetRevisionMapper }
      case domains.specificationDataSheetItem:
        return { model: this.SpecDataSheetItemModel, mapper: this.SpecDataSheetItemMapper }
    }
  }

  /**
   * Insert a new item in the selected database.
   *
   * @param {object} productDevelopment The new attributes to update.
   * @param {number} productDevelopment.id Identifier of the entity to update.
   * @param {object[]} productDevelopment.attributes Array containing the modified attributes.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  insertProductDevelopment = async (productDevelopment, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.insertSpecificationItemDefinition(businessForecastConditions)})`, generateLogInfos(this.pluginInfos))

    const { model, mapper } = this.getModelAndMapperForDomain(messageKey)
    const entity = mapper.convertMessageToAclData(productDevelopment)

    switch (messageKey) {
      // insert brand ref in the StyleBrand table
      case domains.style:
        try {
          const brandRef = productDevelopment.attributes.ADEO_Style_Brand_ref
          // test if brandRef is not undefined
          if (brandRef) {
            const styleBrand = brandRef.map((element) => ({ styleId: productDevelopment.id, productSymbolId: element }))
            await this.SqlHelper.upsertBatch(this.StyleBrandModel, styleBrand)
          }
        } catch (err) {
          this.logger.error(
            `Failed to INSERT the SQL entity in the table ${this.StyleBrandModel.getTableName()} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
      // insert items ref in the SpecDataSheetRevisionItem table
      case domains.specificationDataSheetRevision:
        try {
          const itemsRef = productDevelopment.attributes.Items
          if (itemsRef) {
            const itemsKey = itemsRef.map((element) => ({ specDataSheetRevisionId: productDevelopment.id, specDataSheetItemId: element }))
            await this.SqlHelper.upsertBatch(this.SpecDataSheetRevisionItemModel, itemsKey)
          }
        } catch (err) {
          this.logger.error(
            `Failed to INSERT the SQL entity in the table ${this.SpecDataSheetRevisionItemModel.getTableName()} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
    }

    try {
      await this.SqlHelper.upsertBatch(model, [entity])
      this.logger.info(`Inserted new entity with id ${entity.id} in the table ${model.getTableName()}`, generateLogInfos(this.pluginInfos))
    } catch (err) {
      this.logger.error(
        `Failed to INSERT the SQL entity in the table ${model.getTableName()} for the following reason: ${err.message}`,
        generateLogInfos(this.pluginInfos, { entity }, err))
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.insertEntity()`, generateLogInfos(this.pluginInfos))
    }
  }

  /**
   * Update an existing item in the selected database.
   *
   * @param {object} productDevelopment The new attributes to update.
   * @param {number} productDevelopment.id Identifier of the entity to update.
   * @param {object[]} productDevelopment.attributes Array containing the modifier attributes.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  updateproductDevelopment = async (productDevelopment, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.updateBusinessForecastConditions(businessForecastConditions=${util.inspect(productDevelopment)})`, generateLogInfos(this.pluginInfos))
    const { model, mapper } = this.getModelAndMapperForDomain(messageKey)

    const existingEntity = await model.findByPk(productDevelopment.id)

    if (!existingEntity) {
      this.logger.error(`Unable to find an existing ${model.getTableName()} to UPDATE with id: ${productDevelopment.id}`, generateLogInfos(this.pluginInfos))
      return
    }

    switch (messageKey) {
      // insert new keys in the table StyleBrand if the update has new brand refs
      case domains.style:
        try {
          const brandRef = productDevelopment.attributes.ADEO_Style_Brand_ref
          // test if brandRef is not undefined
          if (brandRef) {
            const brandRefMap = brandRef.map((element) => ({ styleId: productDevelopment.id, productSymbolId: element }))
            await this.SqlHelper.upsertBatch(this.StyleBrandModel, brandRefMap)
          }
        } catch (err) {
          this.logger.error(
            `Failed to INSERT the SQL entity in the table ${this.StyleBrandModel.getTableName()} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
      // insert new keys in the table SpecDataSheetRevisionItem if the update has new items refs
      case domains.specificationDataSheetRevision:
        try {
          const itemsRef = productDevelopment.attributes.Items
          if (itemsRef) {
            const itemsKey = itemsRef.map((element) => ({ specDataSheetRevisionId: productDevelopment.id, specDataSheetItemId: element }))
            await this.SqlHelper.upsertBatch(this.SpecDataSheetRevisionItemModel, itemsKey)
          }
        } catch (err) {
          this.logger.error(
            `Failed to INSERT the SQL entity in the table ${this.SpecDataSheetRevisionItemModel.getTableName()} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
    }

    const convertedData = mapper.convertMessageToAclData(productDevelopment)
    const keys = Object.keys(convertedData)
    keys.forEach((key) => {
      // eslint-disable-next-line security/detect-object-injection
      existingEntity.dataValues[key] = convertedData[key]
    })

    try {
      await this.SqlHelper.upsertBatch(model, [existingEntity.dataValues])
      this.logger.info(`Updated entity with id ${productDevelopment.id} in the database`, generateLogInfos(this.pluginInfos))
    } catch (err) {
      this.logger.error(
        `Failed to UPDATE the SQL entity with id ${productDevelopment.id} from the table ${model.getTableName()} for the following reason: ${err.message}`,
        generateLogInfos(this.pluginInfos, existingEntity, err))
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.updateEntity()`, generateLogInfos(this.pluginInfos))
    }
  }

  /**
   * Delete an item in the selected database.
   *
   * @param {number} id Identifier of the BusinessForecastConditions to delete.
   * @param {string} messageKey Key of the message (SpecificationItemDefinition, SpecificationSectionItem, ..)
   */
  deleteProductDevelopment = async (id, messageKey) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.deleteEntity(domain=${messageKey}, id=${id})`, generateLogInfos(this.pluginInfos))

    const { model } = this.getModelAndMapperForDomain(messageKey)

    const existingEntity = await model.findByPk(id)

    if (!existingEntity) {
      this.logger.error(`Unable to find an existing ${model.getTableName()} to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
      return
    }

    switch (messageKey) {
      // delete all the styleId selected in the table StyleBrand
      case domains.style:
        try {
          const where = { styleId: id }
          const existingStyleBrand = await this.StyleBrandModel.findAll({ where })
          if (existingStyleBrand.length === 0) {
            this.logger.error(`Unable to find an existing StyleBrand to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
            return
          }
          await this.StyleBrandModel.destroy({ where })
          this.logger.info(`Deleted entity with id ${id} from the database`, generateLogInfos(this.pluginInfos))
        } catch (err) {
          this.logger.error(
            `Failed to DELETE the SQL entity with id: ${id} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
      // delete all the specDataSheetRevisionId selected in the table SpecDataSheetRevisionItem
      case domains.specificationDataSheetRevision:
        try {
          const where = { specDataSheetRevisionId: id }
          const existingSpecDataSheetRevisionItem = await this.SpecDataSheetRevisionItemModel.findAll({ where })
          if (existingSpecDataSheetRevisionItem.length === 0) {
            this.logger.error(`Unable to find an existing SpecDataSheetRevisionItem to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
            return
          }
          await this.SpecDataSheetRevisionItemModel.destroy({ where })
          this.logger.info(`Deleted entity with id ${id} from the database`, generateLogInfos(this.pluginInfos))
        } catch (err) {
          this.logger.error(
            `Failed to DELETE the SQL entity with id: ${id} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
      // delete the StyleBrand selected link to the productSymbol
      case domains.productSymbol:
        try {
          const where = { productSymbolId: id }
          const existingStyleBrand = await this.StyleBrandModel.findAll({ where })
          if (existingStyleBrand.length === 0) {
            this.logger.error(`Unable to find an existing StyleBrand to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
            return
          }
          await this.StyleBrandModel.destroy({ where })
          this.logger.info(`Deleted entity with id ${id} from the database`, generateLogInfos(this.pluginInfos))
        } catch (err) {
          this.logger.error(
            `Failed to DELETE the SQL entity with id: ${id} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
      // delete the SpecDataSheetRevisionItem selected link to the specificationDataSheetItem
      case domains.specificationDataSheetItem:
        try {
          const where = { specDataSheetItemId: id }
          const existingSpecDataSheetRevisionItem = await this.SpecDataSheetRevisionItemModel.findAll({ where })
          if (existingSpecDataSheetRevisionItem.length === 0) {
            this.logger.error(`Unable to find an existing SpecDataSheetRevisionItem to DELETE with id: ${id}`, generateLogInfos(this.pluginInfos))
            return
          }
          await this.SpecDataSheetRevisionItemModel.destroy({ where })
          this.logger.info(`Deleted entity with id ${id} from the database`, generateLogInfos(this.pluginInfos))
        } catch (err) {
          this.logger.error(
            `Failed to DELETE the SQL entity with id: ${id} for the following reason: ${err.message}`,
            generateLogInfos(this.pluginInfos, err))
        }
        break
    }

    try {
      await existingEntity.destroy()
      this.logger.info(`Deleted entity with id ${id} from the table ${model.getTableName()}`, generateLogInfos(this.pluginInfos))
    } catch (err) {
      this.logger.error(
        `Failed to DELETE the SQL entity with id ${id} from the table ${model.getTableName()} for the following reason: ${err.message}`,
        generateLogInfos(this.pluginInfos, { existingEntity }, err))
    } finally {
      this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.deleteEntity()`, generateLogInfos(this.pluginInfos))
    }
  }
}
