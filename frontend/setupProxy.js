const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000', // URL of your backend server
      changeOrigin: true,
      secure: false,  // Set to true if your backend uses HTTPS
      headers: {
        'X-Forwarded-Proto': 'http', // Ensure correct protocol is forwarded
      },
      onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      }
    })
  );
};
