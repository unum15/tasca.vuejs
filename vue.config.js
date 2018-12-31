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
    public: 'tascalocal.truecomputing.biz'
  } 
};