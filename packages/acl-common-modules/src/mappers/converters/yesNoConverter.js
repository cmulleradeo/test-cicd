export default (inputField) => {
  switch (inputField) {
    case 'ADEO_YesNo:No': return 'No'
    case 'ADEO_YesNo:Yes': return 'Yes'
    default: return null
  }
}
