const path = require('path')

module.exports = {
  publicPath: '/mind-map/',
  lintOnSave: false,
  productionSourceMap: false,
  filenameHashing: false,
  transpileDependencies: ['yjs', 'lib0'],
  devServer: {
    port: '9091',
    proxy: {
      '^/api': {
        target: 'http://localhost:9222/',
        changeOrigin: true
      },
      '^/static': {
        target: 'http://localhost:9222/',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    // 移除 preload 插件
    config.plugins.delete('preload')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 给插入html页面内的js和css添加hash参数
    config.plugin('html').tap(args => {
      args[0].hash = true
      return args
    })
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/')
      }
    }
  }
}
