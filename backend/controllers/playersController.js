const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getPlayersData = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv'); // Feste Datei "PLAYERS.csv"
  console.log(`Attempting to access file at: ${filePath}`);
  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' })) // Passe den Separator an, falls die Datei einen anderen verwendet
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
  getPlayersData,
};
