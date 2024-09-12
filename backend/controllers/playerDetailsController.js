const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Funktion: Die letzten 10 Spiele eines Spielers (PlayerDetails.csv)
const getLast10Games = (req, res) => {
  const filePath = path.join(__dirname, '../data/PlayerDetails.csv');
  const { playerID } = req.params;

  if (!playerID) {
    return res.status(400).send('PlayerID is required');
  }

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

      if (cleanedRow.PlayerID === playerID) {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      // Sicherstellen, dass das Datum im richtigen Format ist (TT.MM.YYYY)
      results.forEach((game) => {
        const [day, month, year] = game.Date.split('.');
        game.DateObject = new Date(`${year}-${month}-${day}`);
      });

      // Nach dem Datumsobjekt sortieren
      results.sort((a, b) => new Date(b.DateObject) - new Date(a.DateObject));

      const last10Games = results.slice(0, 10); // Nur die letzten 10 Spiele

      if (!res.headersSent) {
        res.json(last10Games);
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
  getLast10Games, // Nur diese Funktion bleibt in playerDetailsController.js
};
