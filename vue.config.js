/* eslint-disable no-undef */
const webpack = require('webpack')
const path = require('path')
module.exports = {
  outputDir: 'docs',
  assetsDir: '',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Index Page',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  },
  lintOnSave: process.env.NODE_ENV !== 'production' ? 'default' : false,
  runtimeCompiler: true,
  productionSourceMap: true, // 生产环境是否生成 sourceMap 文件
  // css: {
  //   requireModuleExtension: false,
  //   extract: true, 
  //   sourceMap: false, 
  //   loaderOptions: {}
  // },
  devServer: {// 环境配置
    host: 'localhost',
    port: 5000,
    https: false,
    hotOnly: false,
    open: true, // 配置自动启动浏览器
  },
  configureWebpack: {
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
      }
    },
    devtool: 'source-map'
  }
}