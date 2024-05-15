const createServer = require("./server");

const server = createServer();

const port = 3001;
const host = "localhost";

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
