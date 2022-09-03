export default (inputField) => {
  switch (inputField) {
    case 'ADEO_ProcessType:010':
      return 'Project'
    case 'ADEO_ProcessType:020':
      return 'Serial Life – Range Continuous Improvement'
    case 'ADEO_ProcessType:030':
      return 'Serial Life – Product Continuous Improvement'
    case 'ADEO_ProcessType:050':
      return 'Serial Life – Sourcing change'
    default:
      return null
  }
}
