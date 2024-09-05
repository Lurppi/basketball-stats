const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getTeamsData = (req, res) => {
  const filePath = path.join(__dirname, '../data/TEAMS.csv'); // Fester Dateipfad
  const results = [];

  // Überprüfen, ob die Datei existiert
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    // CSV-Datei einlesen und verarbeiten
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))  // Verwende das ';' als Trennzeichen (anpassen falls nötig)
      .on('data', (data) => {
        // Verarbeite die Datenzeilen
        const formattedData = {};
        const headers = Object.keys(data)[0].split(';');  // Header aus der ersten Zeile der CSV-Datei
        const values = Object.values(data)[0].split(';');  // Werte aus der Zeile der CSV-Datei

        // Übersetze die Zeile in ein Key-Value-Objekt
        headers.forEach((header, index) => {
          formattedData[header.trim()] = values[index] ? values[index].trim() : '';  // Entferne Leerzeichen und überprüfe auf undefined
        });

        results.push(formattedData);
      })
      .on('end', () => {
        // Die CSV-Datei wurde erfolgreich verarbeitet
        res.json(results);  // Sende die Ergebnisse im JSON-Format an das Frontend
      })
      .on('error', (err) => {
        console.error(`Error reading the CSV file: ${err}`);
        res.status(500).send('Error reading the CSV file');
      });
  });
};

module.exports = {
  getTeamsData,
};
