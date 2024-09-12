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
