const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.txt");
fs.readFile(filePath, "utf-8", (data) => {
  console.log(data);
});
