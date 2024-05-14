const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.txt");
fs.readFile(filePath, "utf-8", (error, data) => {
  if (error) {
    console.error("Erreur lors de la lecture du fichier", error);
    return;
  }

  for (let i = 0; i < data.length; i += 2) {
    /* permet d'écrire à la suite les caractères */
    process.stdout.write(data[i]);
  }
});
