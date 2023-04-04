const fs = require('fs');

const studentsData = require('../results/data.json');

const folderName = '../etudiants';
if (!fs.existsSync(folderName)) {
  fs.mkdirSync(folderName);
}

const generateNFTs = () => {
    // ajout compteur 
    let compteur = 1;
  studentsData.forEach((student) => {
    const attributes = [
      {
        display_type: 'date',
        trait_type: 'Date Mint',
        value: Date.now(),
      },  
      {
        trait_type: 'Hash',
        value: student.hash,
      },
      {
        trait_type: 'Ecole',
        value: 'ECE PARIS',
      },
      {
        trait_type: 'Promo',
        value: student.Promo,
      },
      {
        trait_type: 'Majeur',
        value: student.Spe,
      },
    ];

    const nft = {
      name: `${student.Promo}_${compteur++}`,
      description: 'Valinity est une société qui stocke des diplômes on chain.',
      image: `https://mekaape.mypinata.cloud/ipfs/+++++++/${student.hash}.png`,
      attributes,
      compiler: 'Valinity',
    };

    fs.writeFile(`${folderName}/${student.hash}.json`, JSON.stringify(nft, null, 2), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Le fichier ${student.hash}.json a été généré avec succès.`);
        }
      });    
  });
};

generateNFTs();
