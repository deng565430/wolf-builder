const commonLoaderRules = [
  {
    test: /\.(jpe?g|png|gif)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          hash: 'sha512',
          digest: 'hex',
          name: 'res/[hash].[ext]',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
          },
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 4,
          },
          pngquant: {
            quality: '75-90',
            speed: 3,
          },
        },
      },
    ],
  },
  { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
  { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'file-loader' },
  {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
      },
      {
        loader: 'svgo-loader',
      },
    ],
  },
]

export default commonLoaderRules
