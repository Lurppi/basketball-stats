const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Funktion für die Stats der letzten Saison eines Spielers basierend auf SEASON_YEAR, LEAGUE und GP
const getPlayerSeasonStats = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
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

      // Sortieren nach SEASON_YEAR als String
      results.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));

      const latestSeason = results[0].SEASON_YEAR;
      const filteredResults = results.filter(row => row.SEASON_YEAR === latestSeason);

      let selectedSeasonData = null;

      // Prüfen ob Spieler sowohl in JBBL als auch in NBBL gespielt hat
      const jbblData = filteredResults.find(row => row.LEAGUE.trim().toUpperCase() === 'JBBL');
      const nbblData = filteredResults.find(row => row.LEAGUE.trim().toUpperCase() === 'NBBL');

      if (jbblData && nbblData) {
        selectedSeasonData = parseInt(jbblData.GP) > parseInt(nbblData.GP) ? jbblData : nbblData;
      } else {
        selectedSeasonData = jbblData || nbblData || filteredResults[0];
      }

      // Vergib die Badges basierend auf den Statistiken der letzten Saison
      const badges = assignBadges(selectedSeasonData);

      // Füge die Badges zu den Rückgabedaten hinzu
      res.json({
        seasonStats: selectedSeasonData,
        badges: badges
      });
    });

    stream.on('error', (err) => {
      console.error(`Error reading the CSV file: ${err}`);
      res.status(500).send('Error reading the CSV file');
    });
  });
};

// Funktion zur Vergabe der Badges basierend auf den definierten Kriterien
const assignBadges = (seasonData) => {
  let badges = [];

  // Funktion zum Protokollieren der vergebenen Badges in der Konsole
  const logBadge = (badgeName) => {
    console.log(`Player: ${seasonData.PLAYER}, PlayerID: ${seasonData.PlayerID}, Badge: ${badgeName}, Season: ${seasonData.SEASON_YEAR}`);
  };

  // Sharpshooter Badge
  if (parseFloat(seasonData['3P%']) > 35 && parseFloat(seasonData['3PAPG']) >= 4 && parseFloat(seasonData['3PA']) >= 20) {
    badges.push("Sharpshooter");
    logBadge("Sharpshooter");
  }

  // Volume Scorer Badge
  if (parseFloat(seasonData['PPG']) >= 20 && parseFloat(seasonData['FGAPG']) >= 12) {
    badges.push("Volume Scorer");
    logBadge("Volume Scorer");
  }

  // Inside Scorer Badge
  if (parseFloat(seasonData['2P%']) > 55 && parseFloat(seasonData['2PAPG']) >= 6 && parseFloat(seasonData['2PA']) >= 20) {
    badges.push("Inside Scorer");
    logBadge("Inside Scorer");
  }

  // Free Throw Ace Badge
  if (parseFloat(seasonData['FT%']) > 80 && parseFloat(seasonData['FTA']) >= 20) {
    badges.push("Free Throw Ace");
    logBadge("Free Throw Ace");
  }

  // Lockdown Defender Badge
  if (parseFloat(seasonData['SPG']) >= 1.5 && parseFloat(seasonData['ST%']) >= 2.5 && parseFloat(seasonData['STOPS_Gm']) >= 5 && parseFloat(seasonData['DRTG_ADJ']) < 85) {
    badges.push("Lockdown Defender");
    logBadge("Lockdown Defender");
  }

  // Rim Protector Badge
  if (parseFloat(seasonData['BPG']) >= 2 && parseFloat(seasonData['BS%']) >= 2.0 && parseFloat(seasonData['DRTG_ADJ']) < 95) {
    badges.push("Rim Protector");
    logBadge("Rim Protector");
  }

  // Rebounder Badge
  if (parseFloat(seasonData['RPG']) >= 8 && parseFloat(seasonData['ORB%']) >= 8 && parseFloat(seasonData['DRB%']) >= 18 && parseFloat(seasonData['REB%']) >= 15) {
    badges.push("Rebounding Machine");
  }

  // Playmaker Badge
  if (parseFloat(seasonData['AS_TO']) > 1.5 && parseFloat(seasonData['AS_RATE']) >= 20 && parseFloat(seasonData['AS_RATIO']) >= 7.0) {
    badges.push("Playmaker");
  }

  // Floor General Badge
  if (parseFloat(seasonData['AS_TO']) > 3.0 && parseFloat(seasonData['AS_RATE']) >= 25 && parseFloat(seasonData['AS_RATIO']) >= 10.0) {
    badges.push("Floor General");
  }

  // Two-Way Player Badge
  if (parseFloat(seasonData['ORTG_ADJ']) > 110 && parseFloat(seasonData['DRTG_ADJ']) < 85 && parseFloat(seasonData['NRTG_ADJ']) > 0) {
    badges.push("Two-Way Player");
  }

  // Efficient Shooter Badge
  if (parseFloat(seasonData['EFG%']) > 55 && parseFloat(seasonData['TS%']) > 60 && parseFloat(seasonData['FGA']) >= 20 && parseFloat(seasonData['3PA']) >= 10 && parseFloat(seasonData['FGAPG']) >= 4) {
    badges.push("Efficient Shooter");
  }

  // High Impact Player Badge
  if (parseFloat(seasonData['PER']) > 30 && parseFloat(seasonData['WS_40']) > 0.20 && parseFloat(seasonData['PIE']) > 10.0) {
    badges.push("High Impact Player");
  }

  // Sixth Man Badge
  if (parseFloat(seasonData['MPG']) < 20 && parseFloat(seasonData['PPG']) >= 8.5 && parseFloat(seasonData['APG']) >= 2 && parseFloat(seasonData['RPG']) >= 3) {
    badges.push("Sixth Man");
  }

  return badges;
};

// Neue Funktion zum Abrufen der Stats eines Spielers basierend auf PlayerID
const getPlayerStatsBySeasonType = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
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
      if (results.length === 0) {
        console.log(`No stats found for player ${playerID}`);
        return res.status(404).send('No stats found');
      }

      results.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));

      res.json(results); // Rückgabe aller gefilterten Datensätze
    });

    stream.on('error', (err) => {
      console.error(`Error reading the CSV file: ${err}`);
      res.status(500).send('Error reading the CSV file');
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
      res.json(results);
    });

    stream.on('error', (err) => {
      console.error(`Error reading the CSV file: ${err}`);
      res.status(500).send('Error reading the CSV file');
    });
  });
};

module.exports = {
  getPlayersData,
  getPlayerSeasonStats,
  getPlayerStatsBySeasonType, // Neue Funktion exportieren
};
