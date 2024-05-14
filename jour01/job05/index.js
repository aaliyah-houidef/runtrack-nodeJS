const path = require("path");

const filePath = "/job05/index.js";

const fileName = path.basename(filePath);
console.log("Nom du fichier: " + fileName);

const fileExtension = path.extname(filePath);
console.log("Extension du fichier: " + fileExtension);

const fileParentDirectory = path.dirname(filePath);
console.log("Répertoire parent du fichier: " + fileParentDirectory);
