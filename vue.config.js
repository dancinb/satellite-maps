module.exports = {
  publicPath: '/maps/',
  productionSourceMap: false,

  pwa: {
    name: '中国天宫空间站实时位置 🛰'
  },

  pages: {
    index: {
      entry: 'src/main.ts',
      title: '中国天宫空间站实时位置 🛰'
    }
  },
}