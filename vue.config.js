module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.tasca.truecomputing.biz/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  } 
};