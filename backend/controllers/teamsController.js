const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getTeamsData = (req, res) => {
  const fileName = req.query.file; // Erwartet 'file' als Query-Parameter
  if (!fileName) {
    return res.status(400).send('No file specified');
  }

  const filePath = path.join(__dirname, `../data/${fileName}.csv`);
  const results = [];

  // Überprüfen, ob die Datei existiert
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    // CSV-Datei auslesen
    const stream = fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }));  // Verwenden des richtigen Separators

    stream.on('data', (row) => {
      const cleanedRow = {};
      for (let key in row) {
        const cleanedKey = key.replace(/\uFEFF/g, '').trim();
        cleanedRow[cleanedKey] = row[key].replace(/\uFEFF/g, '').trim();
      }
      results.push(cleanedRow);  // Bereinigte Daten sammeln
    });

    stream.on('end', () => {
      if (!res.headersSent) {
        res.json(results);  // Bereitstellen der Daten, nachdem das Lesen abgeschlossen ist
      }
    });

    stream.on('error', (err) => {
      console.error(`Error reading the CSV file: ${err}`);
      if (!res.headersSent) {
        res.status(500).send('Error reading the CSV file');
      }
    });
  });
};

const getAllTeamsByStat = (req, res) => {
  const filePath = path.join(__dirname, '../data/TEAMS.csv');

  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    const stream = fs.createReadStream(filePath).pipe(csv({ separator: ';' }));

    stream.on('data', (row) => {
      const cleanedRow = {};
      for (let key in row) {
        const cleanedKey = key.replace(/\uFEFF/g, '').trim();
        cleanedRow[cleanedKey] = row[key].replace(/\uFEFF/g, '').trim();
      }

      // Filtere Teams basierend auf dem SEASON_TYPE 'SEASON'
      if (cleanedRow.SEASON_TYPE.trim().toUpperCase() === 'SEASON' && cleanedRow.SEASON_YEAR.trim().match(/^\d{8}$/)) {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      if (results.length === 0) {
        console.log('No valid teams found');
        return res.json([]);
      }

      // Ermittle die aktuellste Saison
      results.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));
      const latestSeasonYear = results[0].SEASON_YEAR;

      // Filtere nur die Teams der aktuellsten Saison
      const filteredResults = results.filter(row => row.SEASON_YEAR === latestSeasonYear);

      if (!res.headersSent) {
        res.json(filteredResults); // Rückgabe aller Teams
      }
    });

    stream.on('error', (err) => {
      console.error(`Error reading the CSV file: ${err}`);
      if (!res.headersSent) {
        res.status(500).send('Error reading the CSV file');
      }
    });
  });
};

module.exports = {
  getTeamsData,
  getAllTeamsByStat,
};
