const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getPlayersData = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (row) => {
        const cleanedRow = {};
        for (let key in row) {
          const cleanedKey = key.replace(/\uFEFF/g, ''); // Entfernt Byte-Order-Mark (BOM) falls vorhanden
          cleanedRow[cleanedKey] = row[key];
        }
        results.push(cleanedRow);
      })
      .on('end', () => {
        res.json(results); // Daten an den Client senden
      })
      .on('error', (err) => {
        console.error(`Error reading the CSV file: ${err}`);
        res.status(500).send('Error reading the CSV file');
      });
  });
};

module.exports = {
  getPlayersData,
};
