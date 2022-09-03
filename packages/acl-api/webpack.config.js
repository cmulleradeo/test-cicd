const path = require('path')

const { pick } = require('lodash')
const chalk = require('chalk')
const webpackNodeExternals = require('webpack-node-externals')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = (
  {
    bundles = null
  } = {},
  {
    mode = 'development'
  } = {}
) => {
  const entries = {
    server: './src/server.js'
  }

  const bundlesToBuild = bundles
    // eslint-disable-next-line security/detect-object-injection
    ? bundles.split(',').filter(bundleName => !!entries[bundleName])
    : Object.keys(entries)

  if (!bundlesToBuild.length) {
    throw Error('Specified bundles do not exist.')
  }

  /* eslint-disable no-console */
  console.log(chalk`Building for {cyan.bold ${mode}}`)
  console.log(`• Bundles: ${bundlesToBuild.map(name => chalk.cyan.bold(name)).join(', ')}`)
  /* eslint-enable no-console */

  return {
    mode,

    stats: 'minimal',

    // Entry point.
    entry: pick(entries, bundlesToBuild),

    // Create the bundles at ./.dev/[entry].min.js
    output: mode === 'development' ? {
      path: path.join(__dirname, './.dev/'),
      filename: '[name].min.js',
      // Point sourcemap entries to original disk location (format as URL on Windows).
      devtoolModuleFilenameTemplate: info => path
        .relative(path.join(__dirname, './.dev'), info.absoluteResourcePath)
        .replace(/\\/g, '/')
    } : {
      path: path.join(__dirname, './dist/'),
      filename: '[name].min.js',
      devtoolModuleFilenameTemplate: info => path
        .relative(path.join(__dirname, './dist'), info.absoluteResourcePath)
        .replace(/\\/g, '/')
    },

    // Source map generation.
    devtool: mode === 'production'
      ? 'source-map'
      : 'cheap-module-source-map',

    module: {
      rules: [
        {
          test: /\.json$/i,
          loader: 'json-loader'
        },

        // Use babel to parse js files.
        {
          test: /\.jsx?$/i,
          // Do not parse files in node_modules.
          exclude: /(node_modules)/i,
          loader: 'babel-loader'
        }
      ]
    },

    resolve: {
      // Resolve absolute imports using these paths (in this order).
      modules: [
        './src/',
        './node_modules/'
      ]
    },

    target: 'node',

    node: {
      // Don't replace __dirname and __filename in the bundle.
      __dirname: false,
      __filename: false
    },

    // Don't bundle node modules, except polyfills.
    externals: [
      webpackNodeExternals({
        allowlist: ['core-js', 'regenerator-runtime']
      })
    ],

    plugins: [
      new ESLintPlugin({
        extensions: 'jsx',
        exclude: ['node_modules', 'dist']
      })
    ]
  }
}
