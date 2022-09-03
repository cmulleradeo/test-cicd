/* eslint-disable */
const baseConfig = require('./jest.config');

module.exports = {
   ...baseConfig,
   reporters: [["jest-sonar", {
      outputDirectory: '.reports',
      outputName: 'jest_sonar_report.xml'
  }]]
}