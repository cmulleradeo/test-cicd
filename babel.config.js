module.exports = (api) => {
  const isTest = api.env('test')
  // You can use isTest to determine what presets and plugins to use.

  const plugins = [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties'
  ]

  if (isTest) {
    plugins.unshift('rewire')
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ]
    ],
    plugins,
    comments: false
  }
}
