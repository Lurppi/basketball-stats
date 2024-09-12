// backend/controllers/playerDetailsController.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getPlayerDetailsData = (req, res) => {
  const filePath = path.join(__dirname, '../data/PlayerDetails.csv');
  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    const stream = fs.createReadStream(filePath).pipe(csv({ separator: ';' }));

    stream.on('data', (row) => {
      const cleanedRow = {};
      for (let key in row) {
        const cleanedKey = key.replace(/\uFEFF/g, '').trim();
        cleanedRow[cleanedKey] = row[key].replace(/\uFEFF/g, '').trim();
      }

      // Prüfen, ob alle Felder ausgefüllt sind (leere Zeilen ignorieren)
      if (Object.values(cleanedRow).every(val => val !== '')) {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      // Nach Datum sortieren, falls gewünscht (aufsteigend)
      results.sort((a, b) => new Date(a.Date) - new Date(b.Date));

      if (!res.headersSent) {
        res.json(results);
      }
    });

    stream.on('error', (err) => {
      console.error(`Error reading the CSV file: ${err}`);
      if (!res.headersSent) {
        res.status(500).send('Error reading the CSV file');
      }
    });
  });
};

module.exports = {
  getPlayerDetailsData,
};
