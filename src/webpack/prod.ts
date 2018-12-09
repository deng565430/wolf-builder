import { join,resolve } from "path"
import * as glob from "glob"
import autoprefixer from 'autoprefixer'
import commonLoaderRules from "./common"
// 插件都是一个类，所以我们命名的时候尽量用大写开头
import HtmlWebpackPlugin from "html-webpack-plugin"

import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CleanWebpackPlugin from "clean-webpack-plugin"
import copyWebpackPlugin from "copy-webpack-plugin"

const tsImportPluginFactory = require('ts-import-plugin')

//消除冗余的css
import purifyCssWebpack from "purifycss-webpack"

// 插件都是一个类，所以我们命名的时候尽量用大写开头

const execDir = process.cwd()

import webpack from "webpack"

module.exports = {
  entry: ['babel-polyfill','./src/index.tsx'], // 入口文件
  output: {
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
            },
          }
        ],
        exclude: /node_modules/
      },
      {
				test: /\.js$/,
				use: ['babel-loader'],
				// 不检查node_modules下的js文件
				exclude: '/node_modules/'
      },
      {
				test: /\.html$/,
				// html中的img标签
				use: ["html-withimg-loader"]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader?importLoaders=1',
          options: {
            minimize: true //css压缩
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => [autoprefixer()],
          },
        },
        ]
      },
      {
        test: /\.scss|.css$/,
          use: [
            MiniCssExtractPlugin.loader,
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
          ]

      }
    ]
  },
  // 提取公共代码
  optimization: {
    splitChunks: {
      chunks: "all",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
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
    // 打包前先清空
    new CleanWebpackPlugin('/dist'),
    // 通过new一下这个类来使用插件
    new HtmlWebpackPlugin({
      // 用哪个html作为模板
      // 在src目录下创建一个index.html页面当做模板来用
      template: "./src/index.html",
      hash: true // 会在打包好的bundle.js后面加上hash串
    }),
    require("autoprefixer"),
    new copyWebpackPlugin([{
			from: resolve(execDir,"./src/assets"),
			to: './pulic'
		}]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    // 消除冗余的css代码
		new purifyCssWebpack({
			// glob为扫描模块，使用其同步方法（请谨慎使用异步方法）
			paths: glob.sync(join(__dirname, "src/*.html"))
		}),
  ], // 对应的插件
  mode: "production" // 生产模式
};
