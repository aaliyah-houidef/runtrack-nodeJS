const http = require("http");
const routes = require("./routes");

const requestListener = function (req, res) {
  routes(req, res);
};

const createServer = () => {
  const server = http.createServer(requestListener);
  return server;
};

module.exports = createServer;
