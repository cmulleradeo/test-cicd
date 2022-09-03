module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'standard',
    'plugin:security/recommended',
    'plugin:jsdoc/recommended',
    'plugin:ember/recommended'
  ],
  parser: '@babel/eslint-parser',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['jest', 'jsdoc', 'security', 'scanjs-rules', 'ember', 'xss'],
  rules: {
    'no-use-before-define': ['error', { functions: true, classes: true }],
    'arrow-parens': ['error', 'always'],
    curly: 'error',
    'object-shorthand': 'error',
    'no-undefined': 'error',
    'sort-keys': 0
  },
  settings: {
    'json/ignore-files': ['**/*']
  }
}
