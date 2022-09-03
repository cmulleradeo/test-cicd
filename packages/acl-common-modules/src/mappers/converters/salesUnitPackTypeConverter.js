export default (inputField) => {
  switch (inputField) {
    case 'ADEO_SaleUnitPackType:010': return 'Cardboard box'
    case 'ADEO_SaleUnitPackType:020': return 'Cardboard card'
    case 'ADEO_SaleUnitPackType:030': return 'Paper sleeve'
    case 'ADEO_SaleUnitPackType:040': return 'Paper bag'
    case 'ADEO_SaleUnitPackType:050': return 'Hangtag'
    case 'ADEO_SaleUnitPackType:060': return 'Sticker'
    case 'ADEO_SaleUnitPackType:070': return 'Plastic box'
    case 'ADEO_SaleUnitPackType:080': return 'Blister'
    case 'ADEO_SaleUnitPackType:090': return 'Plastic bag'
    case 'ADEO_SaleUnitPackType:100': return 'Stand-up pouch'
    case 'ADEO_SaleUnitPackType:110': return 'Shrink film'
    case 'ADEO_SaleUnitPackType:120': return 'Plastic hanger'
    case 'ADEO_SaleUnitPackType:130': return 'Fabric bag'
    case 'ADEO_SaleUnitPackType:140': return 'BMC'
    case 'ADEO_SaleUnitPackType:150': return 'Aerosol'
    case 'ADEO_SaleUnitPackType:160': return 'Can'
    case 'ADEO_SaleUnitPackType:170': return 'Bottle'
    case 'ADEO_SaleUnitPackType:180': return 'Cartridge'
    case 'ADEO_SaleUnitPackType:190': return 'Plastic bucket'
    case 'ADEO_SaleUnitPackType:200': return 'Serynge'
    case 'ADEO_SaleUnitPackType:210': return 'Tube'
    case 'ADEO_SaleUnitPackType:220': return 'Spray'
    case 'ADEO_SaleUnitPackType:230': return 'Jerrycan'
    case 'ADEO_SaleUnitPackType:240': return 'Other'
    default: return null
  }
}
