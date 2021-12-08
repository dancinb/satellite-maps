module.exports = {
  publicPath: '/',
  productionSourceMap: false,

  pwa: {
    name: '天宫空间站运行轨迹 🛰'
  },

  pages: {
    index: {
      entry: 'src/main.ts',
      title: '天宫空间站运行轨迹 🛰'
    }
  },
}