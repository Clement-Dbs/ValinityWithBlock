exports.generate = function () {

    const Jimp = require('jimp');
    const fs = require('fs');

    // Chargement des données JSON
    const data = JSON.parse(fs.readFileSync('results/data.json'));

    // On vérifie si le JSON est pas vide
    if (data.length === 0) {
        console.log('JSON is empty');
        return;
    }

    Jimp.read("uploads/font.png", (err, fond) => {
        if (err) throw err;
        fond.resize(500, 500); // Redimensionner l'image
        // Boucle sur chaque entrée dans le JSON
        data.forEach(item => {
            Jimp.read(500, 500, (err, image) => {
                if (err) throw err;
                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
                    image
                        .composite(fond, 0, 0) // Ajouter le fond à l'image
                        .print(font, 2, 0, `ID: ${item.ID}`)
                        .print(font, 2, 250, `Promo: ${item.Promo}`)
                        .print(font, 2, 300, `Spe: ${item.Spe}`)
                        .write(`Images/${item.ID}.png`);
                        
                });
            });
            console.log(`Image ${item.ID} generated`);
        });
    });
};
