const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getTeamsData = (req, res) => {
  const filePath = path.join(__dirname, '../data/TEAMS.csv'); // Ensure correct path to your CSV file
  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    // Read and process the CSV file
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))  // Ändere den Separator auf ','
      .on('data', (row) => {
        // Bereinige die Schlüssel (Spaltennamen) von unerwünschten Zeichen wie dem Byte-Order-Mark (BOM)
        const cleanedRow = {};
        for (let key in row) {
          const cleanedKey = key.replace(/\uFEFF/g, ''); // Entferne BOM falls vorhanden
          cleanedRow[cleanedKey] = row[key];
        }
        results.push(cleanedRow);
      })
      .on('end', () => {
        res.json(results); // Send the parsed results back to the client
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
