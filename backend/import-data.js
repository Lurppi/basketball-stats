const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const csvWriter = require('csv-writer').createObjectCsvWriter;

// Initialer Startwert für die Player-ID
let nextPlayerID = 10000; // Beginne bei 10000

// Helper-Funktion zum Importieren von CSV-Daten
const importCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        if (Object.values(data).some(field => field !== '')) {  // Leere Zeilen filtern
          results.push(data);
        }
      })
      .on('end', () => {
        if (results.length === 0) {
          console.error(`No data found in ${filePath}`);
          return reject(new Error(`No data found in ${filePath}`));
        }
        resolve(results);
      })
      .on('error', (err) => {
        console.error(`Error reading CSV file ${filePath}:`, err.message);
        reject(err);
      });
  });
};

// Hilfsfunktion zur Erstellung einer eindeutigen Player-ID (Zahlenbasiert)
const generatePlayerID = () => {
  return nextPlayerID++; // Verwende den Zähler und erhöhe ihn
};

// Dateien für den Import
const files = {
  players: path.join(__dirname, 'data', 'PLAYERS.csv'),
  playerDetails: path.join(__dirname, 'data', 'PlayerDetails.csv')
};

// Funktion, um die Player-ID hinzuzufügen und beide Dateien zu aktualisieren
const processPlayerData = async () => {
  try {
    const playersData = await importCSV(files.players);
    const playerDetailsData = await importCSV(files.playerDetails);

    // Erstellen eines Mappings { PlayerID: { Player, Birthdate } }
    const playerIDMap = {};

    // PlayerDetails.csv durchlaufen und Player-ID zuweisen
    playerDetailsData.forEach((player) => {
      const nameBirthKey = `${player.Player}_${player.Birthdate}`;

      if (!playerIDMap[nameBirthKey]) {
        const playerID = generatePlayerID(); // Neue ID generieren
        player.PlayerID = playerID;
        playerIDMap[nameBirthKey] = playerID; // Mapping hinzufügen
      } else {
        player.PlayerID = playerIDMap[nameBirthKey]; // Vorhandene ID zuweisen
      }
    });

    // PLAYERS.csv durchlaufen und Player-ID zuweisen
    playersData.forEach((player) => {
      const nameBirthKey = `${player.PLAYER}_${player.BIRTHDATE}`;

      if (playerIDMap[nameBirthKey]) {
        player.PlayerID = playerIDMap[nameBirthKey]; // Mapping verwenden
      } else {
        const playerID = generatePlayerID(); // Neue ID, falls nicht in playerIDMap
        player.PlayerID = playerID;
        playerIDMap[nameBirthKey] = playerID; // Mapping hinzufügen
      }
    });

    // Aktualisierte Daten in die CSV-Dateien zurückschreiben
    await writeCSV(files.playerDetails, playerDetailsData, Object.keys(playerDetailsData[0]));
    await writeCSV(files.players, playersData, Object.keys(playersData[0]));

    console.log('Player-IDs erfolgreich hinzugefügt und Dateien aktualisiert.');
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Daten:', error);
  }
};

// Funktion zum Schreiben in CSV-Dateien
const writeCSV = (filePath, data, headers) => {
  const writer = csvWriter({
    path: filePath,
    header: headers.map((header) => ({ id: header, title: header })),
    fieldDelimiter: ';'
  });
  return writer.writeRecords(data);
};

// Startet den Prozess
processPlayerData();
