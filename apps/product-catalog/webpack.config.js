const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: './src/index.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    // 'auto' lets Webpack derive the public URL at runtime — required for MF
    publicPath: 'auto',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.js', '.vue'],
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        // ts-loader handles TypeScript in both .ts files and Vue SFC script blocks.
        // appendTsSuffixTo makes ts-loader treat Vue SFC virtual modules as TypeScript.
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/], transpileOnly: true },
        },
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
    new VueLoaderPlugin(),

    new ModuleFederationPlugin({
      name: 'productCatalog',
      filename: 'remoteEntry.js',

      // What this remote exposes to any host
      exposes: {
        './mount': './src/mount.ts',
      },

      // Shared dependencies — singleton prevents duplicate Vue instances
      shared: {
        vue: { singleton: true, requiredVersion: '^3.5.0' },
        'vue-router': { singleton: true, requiredVersion: '^4.4.0' },
      },
    }),

    new HtmlWebpackPlugin({ template: './index.html' }),
  ],

  devServer: {
    port: 3001,
    // Allow the shell (3000) to fetch remoteEntry.js from this origin
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true,
  },
}
