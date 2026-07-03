const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    clean: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.(tsx|ts|js)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Allow @use 'shared-styles/src/...' to resolve from packages/
              sassOptions: {
                loadPaths: [path.resolve(__dirname, '../../packages')],
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',

      // Remote registry: name → where its remoteEntry.js lives
      remotes: {
        productCatalog: 'productCatalog@http://localhost:3001/remoteEntry.js',
        // Vite remote: use 'promise import()' so the browser loads the ESM remoteEntry
        // natively at runtime — dynamic import() works in classic scripts on all
        // modern browsers; Webpack inserts this string as-is without trying to compile it.
        cartModule: `promise import("http://localhost:3002/assets/remoteEntry.js")`,
        // Checkout is also Webpack MF — standard remoteEntry.js, no bridge needed.
        // React is shared as a singleton between shell and checkout, so they use the
        // exact same React instance: hooks, context, and refs all work across the boundary.
        checkout: 'checkout@http://localhost:3003/remoteEntry.js',
      },

      // Shared dependencies — singleton avoids duplicate React instances
      shared: {
        react: { singleton: true, requiredVersion: '^19.1.1' },
        'react-dom': { singleton: true, requiredVersion: '^19.1.1' },
        'react-router-dom': { singleton: true, requiredVersion: '^7.1.0' },
      },
    }),

    new HtmlWebpackPlugin({ template: './index.html' }),
  ],

  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
}
