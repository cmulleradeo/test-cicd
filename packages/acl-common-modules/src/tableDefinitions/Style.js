export default class Style {
  /**
   * Return the data table name
   *
   * @returns {string} the data table name
   */
  getTableName = () => {
    return 'Style'
  }

  /**
   * Return attributes of the events table, necessary for the instantiation of the Sequelize Model
   * See {@link https://sequelize.org/master/class/lib/model.js~Model.html#static-method-init|Sequelize init() method} for further information
   *
   * @param {object} DataTypes SQL service DataTypes
   * @returns {object} Object containing table attributes
   */
  getAttributes = (DataTypes) => {
    return {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      matrixId: {
        type: DataTypes.TEXT
      },
      projectName: {
        type: DataTypes.TEXT
      },
      merchProductVersionId: {
        type: DataTypes.INTEGER
      },
      revision: {
        type: DataTypes.INTEGER
      },
      shortDesignation: {
        type: DataTypes.TEXT
      },
      family: {
        type: DataTypes.TEXT
      },
      subDepartement: {
        type: DataTypes.TEXT
      },
      brandType: {
        type: DataTypes.STRING
      },
      valueLevel: {
        type: DataTypes.TEXT
      },
      internationalRange: {
        type: DataTypes.TEXT
      },
      developmentMode: {
        type: DataTypes.TEXT
      },
      productStatus: {
        type: DataTypes.TEXT
      },
      amountOfContent: {
        type: DataTypes.DOUBLE
      },
      unitOfContent: {
        type: DataTypes.TEXT
      },
      specDataSheetId: {
        type: DataTypes.INTEGER
      },
      department: {
        type: DataTypes.TEXT
      },
      firstPrice: {
        type: DataTypes.TEXT
      },
      lineNumber: {
        type: DataTypes.TEXT
      },
      matrixCode: {
        type: DataTypes.TEXT
      },
      newProduct: {
        type: DataTypes.BOOLEAN
      },
      parentGroupId: {
        type: DataTypes.INTEGER
      },
      posterOnly: {
        type: DataTypes.BOOLEAN
      },
      longDesignation: {
        type: DataTypes.TEXT
      },
      productType: {
        type: DataTypes.TEXT
      },
      projectInitialCode: {
        type: DataTypes.TEXT
      },
      projectType: {
        type: DataTypes.TEXT
      },
      segmentId: {
        type: DataTypes.INTEGER
      },
      styleId: {
        type: DataTypes.INTEGER
      },
      usageId: {
        type: DataTypes.INTEGER
      },
      top1000: {
        type: DataTypes.TEXT
      },
      topSample: {
        type: DataTypes.TEXT
      },
      addressForArtwork: {
        type: DataTypes.TEXT
      },
      artworkLanguage: {
        type: DataTypes.TEXT
      },
      callForTender: {
        type: DataTypes.BOOLEAN
      },
      compatibleWith: {
        type: DataTypes.TEXT
      },
      deadline: {
        type: DataTypes.TEXT
      },
      expectedMoq: {
        type: DataTypes.DOUBLE
      },
      fifthAdvantageProduct: {
        type: DataTypes.TEXT
      },
      fourthAdvantageProduct: {
        type: DataTypes.TEXT
      },
      function1: {
        type: DataTypes.TEXT
      },
      function2: {
        type: DataTypes.TEXT
      },
      function3: {
        type: DataTypes.TEXT
      },
      function4: {
        type: DataTypes.TEXT
      },
      goldenSamplesComments: {
        type: DataTypes.TEXT
      },
      goldenSamplesValidation: {
        type: DataTypes.TEXT
      },
      hookablePack: {
        type: DataTypes.TEXT
      },
      idealUseOfProduct: {
        type: DataTypes.TEXT
      },
      innerPackType: {
        type: DataTypes.TEXT
      },
      instructionManual: {
        type: DataTypes.BOOLEAN
      },
      instructionManualOnArtwork: {
        type: DataTypes.STRING
      },
      instructionManualName: {
        type: DataTypes.TEXT
      },
      intellectualProperty: {
        type: DataTypes.BOOLEAN
      },
      legalWarrantyDuration: {
        type: DataTypes.BOOLEAN
      },
      madeInEn: {
        type: DataTypes.TEXT
      },
      mainAdvantageOfProduct: {
        type: DataTypes.TEXT
      },
      masterDecli: {
        type: DataTypes.TEXT
      },
      masterPackType: {
        type: DataTypes.TEXT
      },
      mdhWarrantyDuration: {
        type: DataTypes.DOUBLE
      },
      mop: {
        type: DataTypes.DOUBLE
      },
      nameOfTheProductSerie: {
        type: DataTypes.TEXT
      },
      nameOfVideos: {
        type: DataTypes.TEXT
      },
      nbPrintedColors: {
        type: DataTypes.TEXT
      },
      nbProductSoldUnitPack: {
        type: DataTypes.DOUBLE
      },
      newGtinReason: {
        type: DataTypes.TEXT
      },
      newGtinRequired: {
        type: DataTypes.TEXT
      },
      noticeLanguage: {
        type: DataTypes.TEXT
      },
      numSampleRequestCommunication: {
        type: DataTypes.TEXT
      },
      numSampleRequestGoldenSample: {
        type: DataTypes.DOUBLE
      },
      numSampleRequestSilverSample: {
        type: DataTypes.DOUBLE
      },
      numSampleRequestWorkshop: {
        type: DataTypes.DOUBLE
      },
      packProdType: {
        type: DataTypes.TEXT
      },
      packStatus: {
        type: DataTypes.TEXT
      },
      packWasteInfo: {
        type: DataTypes.TEXT
      },
      palettePcbExpected: {
        type: DataTypes.DOUBLE
      },
      paletteType: {
        type: DataTypes.TEXT
      },
      parcelWeight: {
        type: DataTypes.DOUBLE
      },
      photoVideoSample: {
        type: DataTypes.TEXT
      },
      picIlluseForPack1: {
        type: DataTypes.TEXT
      },
      picIlluseForPack2: {
        type: DataTypes.TEXT
      },
      printingProcess: {
        type: DataTypes.TEXT
      },
      printPackComponent: {
        type: DataTypes.TEXT
      },
      longDesignationOnPack: {
        type: DataTypes.TEXT
      },
      productCreationModification: {
        type: DataTypes.TEXT
      },
      productModificationDesc: {
        type: DataTypes.TEXT
      },
      promotion: {
        type: DataTypes.TEXT
      },
      purchaseInnerExpected: {
        type: DataTypes.TEXT
      },
      purchaseMasterExpected: {
        type: DataTypes.TEXT
      },
      purchaseMerchandisingExpected: {
        type: DataTypes.TEXT
      },
      qtityAddressesArtwork: {
        type: DataTypes.INTEGER
      },
      qtityPicturePlanned: {
        type: DataTypes.INTEGER
      },
      qtityVideoPlanned: {
        type: DataTypes.INTEGER
      },
      salesUnitPackType: {
        type: DataTypes.TEXT
      },
      secondaryAdvantageProduct: {
        type: DataTypes.TEXT
      },
      segmentation: {
        type: DataTypes.TEXT
      },
      silverSampleValidation: {
        type: DataTypes.TEXT
      },
      silverSampleValidationComments: {
        type: DataTypes.TEXT
      },
      sparePartsRequired: {
        type: DataTypes.TEXT
      },
      technicalCode: {
        type: DataTypes.TEXT
      },
      technology: {
        type: DataTypes.TEXT
      },
      thirdAdvantageProduct: {
        type: DataTypes.TEXT
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }
  }
}
