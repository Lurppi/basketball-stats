// backend/controllers/teamsController.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-z0-9_-]/gi, '');
};

const getTeamsData = (req, res) => {
  const file = sanitizeFileName(req.query.file);
  const filePath = path.join(__dirname, `../data/${file}.csv`);
  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' })) // Separator je nach CSV-Datei anpassen
      .on('data', (data) => results.push(data))
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
  getTeamsData,
};
