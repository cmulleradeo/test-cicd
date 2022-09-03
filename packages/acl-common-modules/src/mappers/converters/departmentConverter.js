export default (inputField) => {
  switch (inputField) {
    case 'ADEO_Department:01': return '01 - CONSTRUCTION MATERIALS'
    case 'ADEO_Department:02': return '02 - WOOD'
    case 'ADEO_Department:03': return '03 - ELECTRICITY - PLUMBING'
    case 'ADEO_Department:04': return '04 - TOOLS'
    case 'ADEO_Department:05': return '05 - WOODEN FLOORS - CARPETS - FLOORING'
    case 'ADEO_Department:06': return '06 - TILING'
    case 'ADEO_Department:07': return '07 - BATHROOM'
    case 'ADEO_Department:08': return '08 - COMFORT'
    case 'ADEO_Department:09': return '09 - GARDEN'
    case 'ADEO_Department:10': return '10 - HARDWARE'
    case 'ADEO_Department:11': return '11 - PAINT - HOUSEHOLD PRODUCT'
    case 'ADEO_Department:12': return '12 - DECORATION'
    case 'ADEO_Department:13': return '13 - LIGHTING'
    case 'ADEO_Department:14': return '14 - STORAGE'
    case 'ADEO_Department:17': return '17 - KITCHEN'
    default: return null
  }
}
