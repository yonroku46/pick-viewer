const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/*',
    createProxyMiddleware({
      // target: 'http://3.36.69.67:5000',
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};