const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_DOMAIN,
      changeOrigin: true,
    })
  );
};
