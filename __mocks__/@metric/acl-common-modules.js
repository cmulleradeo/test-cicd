const commonModules = {
  generateLogInfos: jest.fn(),
  constants: {
    domains: {
      collection: 'collection',
      merchCollectionVersion: 'merch_collection_versions',
      merchSecondaryVersion: 'merch_secondary_versions',
      merchSecondaryPlan: 'merch _secondary_plan',
      specSection: 'specification_sections',
      user: 'users'
    },
    rabbitMqOperations: {
      insert: 'INSERT',
      update: 'UPDATE',
      delete: 'DELETE'
    }
  }
}
let database = []

const sqlModel = {
  getTableName: jest.fn(),
  bootstrapModel: jest.fn(),
  findByPk: jest.fn().mockResolvedValue({ save: jest.fn().mockResolvedValue(), destroy: jest.fn().mockResolvedValue() }),
  create: jest.fn().mockResolvedValue()
}
commonModules.sqlModels = {
  BriefProductDevelopmentModel: sqlModel,
  MerchCollectionVersionModel: sqlModel,
  MerchSecondaryVersionModel: sqlModel,
  MerchSecondaryPlanModel: sqlModel,
  SpecSectionModel: sqlModel,
  UserModel: sqlModel
}

class Mapper {
  convertToAclData = (input) => input

  convertApiToAclData = (input) => input
}

commonModules.mappers = {
  BriefProductDevelopmentMapper: Mapper,
  MerchCollectionVersionMapper: Mapper,
  MerchSecondaryVersionMapper: Mapper,
  MerchSecondaryPlanMapper: Mapper,
  SpecSectionMapper: Mapper,
  UserMapper: Mapper
}

commonModules.__initMocks__ = () => {
  database = []
  commonModules.SqlHelper = class SqlHelper {
    upsertBatch = (_model, data) => {
      database = data
    }
  }
}
commonModules.__getDatabase__ = () => database
commonModules.__breakUpsertBatch__ = (error) => {
  commonModules.SqlHelper = class SqlHelper {
    upsertBatch = jest.fn().mockRejectedValue(error)
  }
}

module.exports = commonModules
