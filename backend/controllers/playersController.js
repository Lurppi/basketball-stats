const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Funktion für die Stats der letzten Saison eines Spielers basierend auf SEASON_YEAR, LEAGUE und GP
const getPlayerSeasonStats = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv'); // Wir greifen auf die PLAYERS.csv zu
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

      // Sicherstellen, dass SEASON_TYPE und PlayerID korrekt sind
      if (cleanedRow.PlayerID === playerID && cleanedRow.SEASON_TYPE.trim().toUpperCase() === 'SEASON') {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      if (results.length === 0) {
        console.log(`No season stats found for player ${playerID}`);
        return res.status(404).send('No season stats found');
      }

      // Log results before sorting
      console.log(`Raw season results for player ${playerID}:`, results);

      // Sortieren nach SEASON_YEAR als String
      results.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));

      // Log after sorting
      console.log(`Sorted season results for player ${playerID}:`, results);

      // Filtern für JBBL und NBBL, um die Saison mit den meisten GP zu finden
      const latestSeason = results[0].SEASON_YEAR; // Neueste Saison
      console.log(`Latest season year for player ${playerID}: ${latestSeason}`);

      const filteredResults = results.filter(row => row.SEASON_YEAR === latestSeason);

      console.log(`Filtered results for latest season ${latestSeason} for player ${playerID}:`, filteredResults);

      let selectedSeasonData = null;

      // Prüfen ob Spieler sowohl in JBBL als auch in NBBL gespielt hat
      const jbblData = filteredResults.find(row => row.LEAGUE.trim().toUpperCase() === 'JBBL');
      const nbblData = filteredResults.find(row => row.LEAGUE.trim().toUpperCase() === 'NBBL');

      console.log(`JBBL Data for player ${playerID}:`, jbblData);
      console.log(`NBBL Data for player ${playerID}:`, nbblData);

      if (jbblData && nbblData) {
        // Wenn in beiden Ligen gespielt, wähle den Datensatz mit den meisten GP
        selectedSeasonData = parseInt(jbblData.GP) > parseInt(nbblData.GP) ? jbblData : nbblData;
      } else {
        // Ansonsten nimm die verfügbaren Daten
        selectedSeasonData = jbblData || nbblData || filteredResults[0];
      }

      console.log(`Selected season data for player ${playerID}:`, selectedSeasonData);

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

// Funktion für das Abrufen der PLAYERS-Daten ohne Filter
const getPlayersData = (req, res) => {
  const fileName = req.query.file;
  if (!fileName) {
    return res.status(400).send('No file specified');
  }

  const filePath = path.join(__dirname, `../data/${fileName}.csv`);
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
      results.push(cleanedRow);
    });

    stream.on('end', () => {
      if (!res.headersSent) {
        res.json(results);
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
  getPlayersData,
  getPlayerSeasonStats,
};
