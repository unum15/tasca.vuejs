module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://tasca/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    },
    host: 'tascalocal.waterscontracting.com'
  },
};