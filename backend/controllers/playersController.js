const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getPlayersData = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv'); // Fester Dateipfad
  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))  // Verwende das ';' als Trennzeichen
      .on('data', (data) => {
        // Verarbeite die Datenzeilen
        const formattedData = {};
        const headers = Object.keys(data)[0].split(';');  // Header aus der ersten Zeile der CSV-Datei
        const values = Object.values(data)[0].split(';');  // Werte aus der Zeile der CSV-Datei

        // Übersetze die Zeile in ein Key-Value-Objekt
        headers.forEach((header, index) => {
          formattedData[header.trim()] = values[index].trim();  // Entferne Leerzeichen an den Rändern
        });

        results.push(formattedData);
      })
      .on('end', () => {
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
