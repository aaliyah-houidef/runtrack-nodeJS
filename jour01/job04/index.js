const fs = require("fs");

/* withFileTypes: true : permet d'afficher seulement les dossiers visibles (sans les éléments masqués) */
fs.readdir("../jour01", { withFileTypes: true }, (error, files) => {
  if (error) {
    console.error("Erreur lors de la lecture du répertoire : " + error);
    return;
  }

  const folders = files
    .filter((file) => file.isDirectory())
    .map((folder) => folder.name);
  console.log("Contenu du répertoire courant :");
  folders.forEach((folder) => console.log(folder));
});
