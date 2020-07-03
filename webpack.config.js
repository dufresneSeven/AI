const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装

module.exports={
    mode:'development',
    entry:'./src/app.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    module: {
        rules: [
          { test: /\.vue$/, use: 'vue-loader' }
        ]
      },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'})
      ]
}