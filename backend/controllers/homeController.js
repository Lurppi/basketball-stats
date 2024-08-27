// backend/controllers/homeController.js
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

// Funktion zum Abrufen der Top 3 Performer aus einer CSV-Datei
const getTop3Performers = (filePath, res) => {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv({ separator: ';' })) // Verwenden des richtigen Trennzeichens
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Die ersten 3 Zeilen sind die Top 3 Performer
      const top3 = results.slice(0, 3);
      res.json(top3);
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Error reading CSV file' });
    });
};

// Route für wöchentliche Top 3 Performer
const getWeeklyTop3 = (req, res) => {
  const { category } = req.params;
  const filePath = path.join(__dirname, `../data/${category}-week.csv`);
  getTop3Performers(filePath, res);
};

// Route für saisonale (regular) oder Playoff Top 3 Performer
const getSeasonOrPlayoffsTop3 = (req, res) => {
  const { type, category } = req.params;
  const filePath = path.join(__dirname, `../data/${category}-${type}.csv`);
  getTop3Performers(filePath, res);
};

module.exports = {
  getWeeklyTop3,
  getSeasonOrPlayoffsTop3,
};
