import { resolve } from "path"
import autoprefixer from 'autoprefixer'
import commonLoaderRules from "./common"
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
// 插件都是一个类，所以我们命名的时候尽量用大写开头
import HtmlWebpackPlugin from "html-webpack-plugin"
const tsImportPluginFactory = require('ts-import-plugin')

import setIterm2Badeg from "set-iterm2-badge"


const execDir = process.cwd()

// 插件都是一个类，所以我们命名的时候尽量用大写开头

import webpack from "webpack"

setIterm2Badeg('开发环境')

module.exports = {
  entry: ['babel-polyfill','./src/index.tsx'], // 入口文件
  output: {
    filename: "bundle.js", // 打包后的文件名称
    path: resolve("dist"), // 打包后的目录，必须是绝对路径
    chunkFilename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.webpack.js', '.ts', '.tsx', '.js', '.css', '.scss'],
  },
  module: {
    rules:[
      ...commonLoaderRules,
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [ tsImportPluginFactory({
              libraryName: 'antd',
              libraryDirectory: 'lib',
              style: 'css'
            })]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss|.css$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [autoprefixer()],
            },
          },
          { loader: 'resolve-url-loader', options: { sourceMap: true, keepQuery: true } }
        ],
      }
    ]
  },
  // 提取公共代码
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        }
      }
    }
  },
  plugins: [
    // 通过new一下这个类来使用插件
    new HtmlWebpackPlugin({
      hash: false,
      // 用哪个html作为模板
      // 在src目录下创建一个index.html页面当做模板来用
      template: "./src/index.html"
    }),
    new webpack.NamedModulesPlugin(),
    // 热替换，热替换不是刷新
    new webpack.HotModuleReplacementPlugin(),
    new TsconfigPathsPlugin({configFile: resolve(execDir, './tsconfig.json')}),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/)
  ], // 对应的插件
  devServer: {
    contentBase: "./dist",
    host: "localhost", // 默认是localhost
    port: 3000, // 端口
    open: true, // 自动打开浏览器
    hot: true // 开启热更新
  }, // 开发服务器配置
  mode: "development" // 模式配置
};
