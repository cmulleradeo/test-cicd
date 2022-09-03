export default class SqlHelper {
  constructor (config, logger, logInfos) {
    this.config = config
    this.logger = logger
    this.logInfos = logInfos
  }

  upsertBatch = async (model, data, transaction = null) => {
    this.logger.debug(`>>>> Entering in ${this.config.PLUGIN_NAME}.upsertBatch(model=${model.getTableName()}, data)`, this.logInfos)

    const modelDescription = await model.describe()
    const modelFieldsExceptPrimaryKey = Object.keys(modelDescription).filter((field) => {
      // eslint-disable-next-line security/detect-object-injection
      return !modelDescription[field].primaryKey
    })

    while (data.length) {
      await model.bulkCreate(data.splice(0, 10000), {
        transaction,
        updateOnDuplicate: modelFieldsExceptPrimaryKey
      })
    }

    this.logger.debug(`<<<< Exiting ${this.config.PLUGIN_NAME}.upsertBatch()`, this.logInfos)
  }
}
