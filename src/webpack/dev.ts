import { resolve } from "path"
import autoprefixer from 'autoprefixer'
import commonLoaderRules from "./common"
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
// 插件都是一个类，所以我们命名的时候尽量用大写开头
import HtmlWebpackPlugin from "html-webpack-plugin"
const tsImportPluginFactory = require('ts-import-plugin')

const execDir = process.cwd()

// 插件都是一个类，所以我们命名的时候尽量用大写开头

import webpack from "webpack"

module.exports = {
  entry: ['babel-polyfill','./src/index.tsx'], // 入口文件
  output: {
    filename: "bundle.js", // 打包后的文件名称
    path: resolve("dist"), // 打包后的目录，必须是绝对路径
    chunkFilename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['.webpack.js', '.ts', '.tsx', '.js', '.css', '.scss'],
  },
  module: {
    rules:[
      ...commonLoaderRules,
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [ tsImportPluginFactory( /** options */) ]
              }),
              compilerOptions: {
                module: 'es2015'
              }
            }
          }
        ],
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
    splitChunks: {
      chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
      minSize: 0,                // 最小尺寸，默认0
      minChunks: 1,              // 最小 chunk ，默认1
      maxAsyncRequests: 1,       // 最大异步请求数， 默认1
      maxInitialRequests: 1,    // 最大初始化请求书，默认1
      name: () => {
      },              // 名称，此选项课接收 function
      cacheGroups: {                 // 这里开始设置缓存的 chunks
        priority: "0",                // 缓存组优先级 false | object |
        vendor: {                   // key 为entry中定义的 入口名称
          chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          test: /react|lodash/,     // 正则规则验证，如果符合就提取 chunk
          name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
          minSize: 0,
          minChunks: 1,
          enforce: true,
          maxAsyncRequests: 1,       // 最大异步请求数， 默认1
          maxInitialRequests: 1,    // 最大初始化请求书，默认1
          reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
        }
      }
    }
  },
  plugins: [
    // 通过new一下这个类来使用插件
    new HtmlWebpackPlugin({
      // 用哪个html作为模板
      // 在src目录下创建一个index.html页面当做模板来用
      template: "./src/index.html"
    }),
    // 热替换，热替换不是刷新
    new webpack.HotModuleReplacementPlugin(),
    new TsconfigPathsPlugin({configFile: resolve(execDir, './tsconfig.json')}),
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
