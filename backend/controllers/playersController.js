const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getPlayersData = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
  const results = [];  // Variable für Ergebnisse

  // Überprüfen, ob die Datei existiert
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    // Lesen der CSV-Datei
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))  // Verwenden des richtigen Separators
      .on('data', (row) => {
        const cleanedRow = {};
        for (let key in row) {
          // Entfernt BOM und unerwünschte Zeichen sowohl aus dem Schlüssel als auch dem Wert
          const cleanedKey = key.replace(/\uFEFF/g, '').trim();
          cleanedRow[cleanedKey] = row[key].replace(/\uFEFF/g, '').trim();
        }
        results.push(cleanedRow);  // Fügen die bereinigten Daten zur Ergebnisliste hinzu
      })
      .on('end', () => {
        // Sendet die bereinigten Daten zurück an den Client
        res.json(results);
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
