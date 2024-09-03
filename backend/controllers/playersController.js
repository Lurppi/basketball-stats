const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-z0-9_-]/gi, '');
};

const getPlayersData = (req, res) => {
  const file = sanitizeFileName(req.query.file);
  const filePath = path.join(__dirname, `../data/${file}.csv`);
  const results = [];

  res.set('Access-Control-Allow-Origin', '*'); // CORS-Header gleich zu Beginn setzen

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`); // Loggen des genauen Dateipfads
      return res.status(404).send(`File not found: ${filePath}`);
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' })) // Separator je nach CSV-Datei anpassen
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.json(results);
      })
      .on('error', (err) => {
        console.error(`Error reading the CSV file: ${err}`); // Fehler loggen
        res.status(500).send('Error reading the CSV file');
      });
  });
};

module.exports = {
  getPlayersData,
};
