import * as path from "path"
// 插件都是一个类，所以我们命名的时候尽量用大写开头
import HtmlWebpackPlugin from "html-webpack-plugin"

import ExtractTextWebpackPlugin from "extract-text-webpack-plugin"

import CleanWebpackPlugin from "clean-webpack-plugin"

import webpack from "webpack"

export default {
  entry: "./src/index.tsx", // 入口文件
  output: {
    filename: "bundle.js", // 打包后的文件名称
    path: path.resolve("dist"), // 打包后的目录，必须是绝对路径
    chunkFilename: '[name].[hash].js',
  },
  resolve: {
    // 别名
    alias: {
      $: "./src/jquery.js"
    },
    // 省略后缀
    extensions: [".js", ".json", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.(vue|js|jsx|tsx)/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        use: "babel-loader",
        include: /src/, // 只转化src目录下的js
        exclude: /node_modules/ // 排除掉node_modules，优化打包速度
      },
      {
        test: /\.css$/, // 解析css
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              outputPath: "images/" // 图片打包后存放的目录
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/,
        use: "html-withimg-loader"
      },
      {
        test: /\.(eot|ttf|woff|svg)$/,
        use: "file-loader"
      }
    ]
  }, // 处理对应模块
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
    // 打包前先清空
    new CleanWebpackPlugin("dist"),
    // 热替换，热替换不是刷新
    new webpack.HotModuleReplacementPlugin(),
    // 通过new一下这个类来使用插件
    new HtmlWebpackPlugin({
      // 用哪个html作为模板
      // 在src目录下创建一个index.html页面当做模板来用
      template: "./src/index.html",
      hash: true // 会在打包好的bundle.js后面加上hash串
    }),
    // 提取公共代码配置
    new HtmlWebpackPlugin({
      filename: "a.html",
      template: "./src/index.html", // 以index.html为模板
      chunks: ["vendor", "a"]
    }),
    new HtmlWebpackPlugin({
      filename: "b.html",
      template: "./src/index.html", // 以index.html为模板
      chunks: ["vendor", "b"]
    }),
    require("autoprefixer"),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin("css/style.css")
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
