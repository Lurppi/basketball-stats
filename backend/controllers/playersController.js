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
      .pipe(csv({ separator: ';' }))  // Verwende das ';' als Trennzeichen
      .on('headers', (csvHeaders) => {
        // Aufsplitten des ersten Headers falls er zusammenhängend ist
        if (csvHeaders.length === 1 && csvHeaders[0].includes(';')) {
          headers = csvHeaders[0].split(';').map(header => header.trim());  // Spalte und trimme Leerzeichen
        } else {
          headers = csvHeaders.map(header => header.trim());  // Normaler Fall
        }
      })
      .on('data', (row) => {
        const formattedData = {};

        headers.forEach((header, index) => {
          formattedData[header] = row[header] ? row[header].trim() : '';  // Verarbeite die Werte und trimme Leerzeichen
        });

        results.push(formattedData);
      })
      .on('end', () => {
        res.json(results);  // Sende die Ergebnisse im JSON-Format an das Frontend
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
