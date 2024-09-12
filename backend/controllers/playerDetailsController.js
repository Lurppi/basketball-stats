const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Bestehende Funktion: Die letzten 10 Spiele eines Spielers
const getLast10Games = (req, res) => {
  const filePath = path.join(__dirname, '../data/PlayerDetails.csv');
  const { playerID } = req.params;

  if (!playerID) {
    return res.status(400).send('PlayerID is required');
  }

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

      if (cleanedRow.PlayerID === playerID) {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      results.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      const last10Games = results.slice(0, 10); // Nur die letzten 10 Spiele

      if (!res.headersSent) {
        res.json(last10Games);
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

// Neue Funktion: Stats der letzten Saison eines Spielers basierend auf SEASON_YEAR, LEAGUE und GP
const getPlayerSeasonStats = (req, res) => {
  const filePath = path.join(__dirname, '../data/PlayerDetails.csv');
  const { playerID } = req.params;

  if (!playerID) {
    return res.status(400).send('PlayerID is required');
  }

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

      if (cleanedRow.PlayerID === playerID && cleanedRow.SEASON_TYPE === 'SEASON') {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      if (results.length === 0) {
        return res.status(404).send('No season stats found');
      }

      // Sortieren nach SEASON_YEAR
      results.sort((a, b) => parseInt(b.SEASON_YEAR) - parseInt(a.SEASON_YEAR));

      // Filtern für JBBL und NBBL, um die Saison mit den meisten GP zu finden
      const latestSeason = results[0].SEASON_YEAR; // Neueste Saison
      const filteredResults = results.filter(row => row.SEASON_YEAR === latestSeason);

      let selectedSeasonData = null;

      // Prüfen ob Spieler sowohl in JBBL als auch in NBBL gespielt hat
      const jbblData = filteredResults.find(row => row.LEAGUE === 'JBBL');
      const nbblData = filteredResults.find(row => row.LEAGUE === 'NBBL');

      if (jbblData && nbblData) {
        // Wenn in beiden Ligen gespielt, wähle den Datensatz mit den meisten GP
        selectedSeasonData = jbblData.GP > nbblData.GP ? jbblData : nbblData;
      } else {
        // Ansonsten nimm die verfügbare Daten
        selectedSeasonData = jbblData || nbblData || filteredResults[0];
      }

      if (!res.headersSent) {
        res.json(selectedSeasonData);
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
  getLast10Games,
  getPlayerSeasonStats, // Die neue Funktion exportieren
};
