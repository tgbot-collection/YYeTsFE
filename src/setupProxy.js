const { createProxyMiddleware } = require("http-proxy-middleware");
const AES = require("crypto-js/aes");

function genNe1(id) {
  return AES.encrypt(`/api/resource?id=${id}`, `${id}`).toString();
}

module.exports = function setProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_DOMAIN,
      changeOrigin: true,
      onProxyReq(proxyReq, req) {
        const { id } = req.query;

        if (id) {
          proxyReq.setHeader("ne1", genNe1(id));
        }
      },
    })
  );
};
