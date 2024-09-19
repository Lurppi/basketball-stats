const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const csvWriter = require('csv-writer').createObjectCsvWriter;

let nextPlayerID = 10000; // Startwert für Player-ID

// Helper-Funktion zum Importieren von CSV-Daten
const importCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        // Nur vollständige Datenzeilen pushen
        if (Object.values(data).every((val) => val.trim() !== '')) {
          results.push(data);
        }
      })
      .on('end', () => {
        if (results.length === 0) {
          console.error(`No valid data found in ${filePath}`);
          return reject(new Error(`No valid data found in ${filePath}`));
        }
        resolve(results);
      })
      .on('error', (err) => {
        console.error(`Error reading CSV file ${filePath}:`, err.message);
        reject(err);
      });
  });
};

// Funktion zur Vergabe der Badges basierend auf den definierten Kriterien
const assignBadges = (seasonData) => {
  let badges = [];

  // Floor General Badge
  if (parseFloat(seasonData['AS_TO']) > 2.0 && parseFloat(seasonData['AS_RATE']) >= 25 && parseFloat(seasonData['AS_RATIO']) >= 10.0) {
    badges.push("Floor General");
  }

  // Two-Way Player Badge
  if (parseFloat(seasonData['ORTG_ADJ']) > 110 && parseFloat(seasonData['DRTG_ADJ']) < 90 && parseFloat(seasonData['NRTG_ADJ']) > 0) {
    badges.push("Two-Way Player");
  }

  // Efficient Shooter Badge
  if (parseFloat(seasonData['EFG%']) > 55 && parseFloat(seasonData['TS%']) > 60 && parseFloat(seasonData['FGA']) >= 20 && parseFloat(seasonData['3PA']) >= 10 && parseFloat(seasonData['3PAPG']) >= 2.0) {
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

// Funktion, um den besten Datensatz einer Saison für die Badges auszuwählen
const getBestSeasonData = (playerSeasons) => {
  const groupedBySeason = {};

  // Gruppiere nach Saison
  playerSeasons.forEach(row => {
    if (!groupedBySeason[row.SEASON_YEAR]) {
      groupedBySeason[row.SEASON_YEAR] = [];
    }
    groupedBySeason[row.SEASON_YEAR].push(row);
  });

  // Wähle den Datensatz mit den meisten Minuten pro Saison
  const selectedSeasonData = Object.values(groupedBySeason).map(seasonRows => {
    return seasonRows.reduce((prev, current) => (parseFloat(current.MP) > parseFloat(prev.MP) ? current : prev));
  });

  // Sortiere nach SEASON_YEAR, um den neuesten Datensatz zu finden
  selectedSeasonData.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));

  // Wähle den besten Datensatz aus der letzten Saison
  return selectedSeasonData[0];
};

// Funktion zur Vergabe der Badges für jeden Spieler
const processBadges = async () => {
  try {
    const playersData = await importCSV(path.join(__dirname, 'data', 'PLAYERS.csv'));
    const updatedPlayersData = [];

    const playersGrouped = playersData.reduce((acc, player) => {
      if (!acc[player.PlayerID]) {
        acc[player.PlayerID] = [];
      }
      acc[player.PlayerID].push(player);
      return acc;
    }, {});

    // Für jeden Spieler die Badges basierend auf dem besten Saisondatensatz vergeben
    Object.keys(playersGrouped).forEach(playerID => {
      const playerSeasons = playersGrouped[playerID];

      // Finde den besten Saisondatensatz
      const bestSeasonData = getBestSeasonData(playerSeasons);

      // Vergib Badges für den besten Datensatz
      const badges = assignBadges(bestSeasonData);

      // Aktualisiere die Badges im Datensatz
      playerSeasons.forEach((seasonData) => {
        seasonData.Badges = badges.join(',');
        updatedPlayersData.push(seasonData);
      });
    });

    // Schreibe die aktualisierten Daten in die CSV-Datei zurück
    await writeCSV('data/PLAYERS.csv', updatedPlayersData, Object.keys(updatedPlayersData[0]));

    console.log('Badges successfully assigned.');
  } catch (error) {
    console.error('Error processing badges:', error);
  }
};

// Funktion, um die Player-ID hinzuzufügen und beide Dateien zu aktualisieren
const processPlayerData = async () => {
  try {
    const playersData = await importCSV(path.join(__dirname, 'data', 'PLAYERS.csv'));
    const playerDetailsData = await importCSV(path.join(__dirname, 'data', 'PlayerDetails.csv'));

    const playerIDMap = {};
    playerDetailsData.forEach((player) => {
      const nameBirthKey = `${player.Player}_${player.Birthdate}`;
      if (!playerIDMap[nameBirthKey]) {
        const playerID = nextPlayerID++;
        player.PlayerID = playerID;
        playerIDMap[nameBirthKey] = playerID;
      } else {
        player.PlayerID = playerIDMap[nameBirthKey];
      }
    });

    playersData.forEach((player) => {
      const nameBirthKey = `${player.PLAYER}_${player.BIRTHDATE}`;
      if (playerIDMap[nameBirthKey]) {
        player.PlayerID = playerIDMap[nameBirthKey];
      } else {
        const playerID = nextPlayerID++;
        player.PlayerID = playerID;
        playerIDMap[nameBirthKey] = playerID;
      }
    });

    await writeCSV('data/PlayerDetails.csv', playerDetailsData, Object.keys(playerDetailsData[0]));
    await writeCSV('data/PLAYERS.csv', playersData, Object.keys(playersData[0]));

    console.log('Player-IDs successfully added.');

    // Nach Zuweisung der PlayerIDs, Badges generieren
    await processBadges();
  } catch (error) {
    console.error('Error processing data:', error);
  }
};

// Funktion zum Schreiben in CSV-Dateien
const writeCSV = (filePath, data, headers) => {
  const writer = csvWriter({
    path: filePath,
    header: headers.map((header) => ({ id: header, title: header })),
    fieldDelimiter: ';',
  });
  return writer.writeRecords(data);
};

// Starte den Prozess
processPlayerData();
