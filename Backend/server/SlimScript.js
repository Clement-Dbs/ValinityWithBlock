const fs = require("fs");
const crypto = require("crypto");
const NFT = require("./NFTGeneration.js");

// check if uploads/export.csv exists
if (!fs.existsSync("uploads/export.csv")) {
    console.log("CSV file not found or uploads folder not created");
    return;
}

fs.readFile("results/ece.json", "utf-8", (err, content) => {
    let existingData = {};
    if (!err) {
        existingData = JSON.parse(content);
    }
    const eceData = {};
    eceData["Ecole"] = "ECE";
    eceData["Promo"] = existingData["Promo"] || {};

    // Lire le fichier CSV
    fs.readFile("uploads/export.csv", "utf-8", (err, content) => {
        if (err) {
            throw err;
        }

        const lines = content.split("\n");

        // Récupérer les noms de colonne
        const columnNames = lines[0].split(";").map((column) => {
            return column.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ0-9\/\-]+/g, "");
        });
        
        const data = [];
        
        for (let i = 1; i < lines.length-1; i++) {
            const columns = lines[i].split(";").map((column) => {
                return column.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ0-9\/\-]/g, "");
            });

            // Modifier la valeur de la colonne "Nom" pour qu'elle soit en majuscules
            // const columnIndex = columnNames.indexOf("Nom");
            // if (columnIndex != -1) {
            //     columns[columnIndex] = columns[columnIndex].toUpperCase();
            // }
        
            // Sélectionner les colonnes à utiliser pour le hashage
            const selectedColumns = [columnNames.indexOf("Nom"), columnNames.indexOf("Prenom"), columnNames.indexOf("Promo"), columnNames.indexOf("Spe")];

            // Hasher les colonnes sélectionnées
            const string = selectedColumns.map(index => columns[index]).join(",");
            const hash = crypto
                .createHash("sha256")
                .update(string, "utf-8")
                .digest("hex");
        
            // Créer un objet pour les données hachées
            const object = { hash };
            for (let j = 0; j < columnNames.length; j++) {
                object[columnNames[j]] = columns[j];
            }
        
            // Ajouter l'objet à la liste de données hachées
            data.push(object);

            // Récupérer les valeurs de Promo et Spe
            const promo = columns[columnNames.indexOf("Promo")];
            const spe = columns[columnNames.indexOf("Spe")];

            // Vérifier si la promo existe déjà
            if (!eceData.Promo.hasOwnProperty(promo)) {
                eceData.Promo[promo] = [];
            }

            // Ajouter la Spe à la promo si elle n'existe pas déjà
            if (!eceData.Promo[promo].includes(spe)) {
                eceData.Promo[promo].push(spe);
            }
        }

        // check if results folder exists
        if (!fs.existsSync("results")) {
            console.log("results folder not created");
            fs.mkdirSync("results");
        }

        
        fs.writeFile("results/data.json", JSON.stringify(data, null, 4), (err) => {
            if (err) {
                throw err;
            }
            NFT.generate();
            // Supprimer le fichier CSV
            fs.unlink("uploads/export.csv", (err) => {
                if (err) {
                    throw err;
                }
            });
        });

        fs.writeFile("results/ece.json", JSON.stringify(eceData, null, 4), (err) => {
            if (err) {
            throw err;
            }
        });
    });
});
