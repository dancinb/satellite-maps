module.exports = {
  publicPath: '/maps/',
  productionSourceMap: false,

  pwa: {
    name: '中国空间站实时位置动态更新 🛰'
  },

  pages: {
    index: {
      entry: 'src/main.ts',
      title: '中国空间站实时位置动态更新 🛰'
    }
  },
}