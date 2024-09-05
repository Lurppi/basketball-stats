const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getPlayersData = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv'); // Fester Dateipfad
  const results = [];
  let headers = [];

  // Überprüfen, ob die Datei existiert
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    // CSV-Datei einlesen und verarbeiten
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))  // Trimme Leerzeichen und nutze ';' als Trennzeichen
      .on('headers', (csvHeaders) => {
        headers = csvHeaders.map(header => header.trim());  // Speichere die Header und trimme Leerzeichen
      })
      .on('data', (row) => {
        const formattedData = {};

        // Fülle das Key-Value-Objekt basierend auf den Headern
        headers.forEach((header) => {
          formattedData[header] = row[header] ? row[header].trim() : '';  // Verarbeite die Werte und trimme Leerzeichen
        });

        results.push(formattedData);
      })
      .on('end', () => {
        // Sende die Ergebnisse im JSON-Format an das Frontend
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
