const path = require('path');
const webpack = require("webpack");
const  VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装


const config = {
    mode:'development',
    entry:'./src/app.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    module: {
        rules: [
          { test: /\.vue$/, use: 'vue-loader' },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader'
              }
            ]
          },
          
        ]
      },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
          'process.env':{
            NODE_ENV:"development",
          }
    
        }),
      ]
}

config.devtool='#cheap-module-eval-source-map',

  config.devServer={
    contentBase: path.join(__dirname, "dist"),

    port:8000,

    host:'0.0.0.0',

    overlay:{

      errors:true

    },

    // open:true  //每次都打开一个网页

    hot:true //只渲染一个组件

  }

  config.plugins.push(

    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

  )

module.exports = config;