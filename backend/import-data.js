const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Helper-Funktion zum Importieren von CSV-Daten
const importCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' })) // Passe den Separator an, falls nötig
      .on('data', (data) => results.push(data))
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

// Alle CSV-Dateien importieren
const files = [
  // Teams Regular Season
  { path: path.join(__dirname, 'data', 'TRS_Totals.csv'), name: 'teams_regular_totals' },
  { path: path.join(__dirname, 'data', 'TRS_Averages.csv'), name: 'teams_regular_averages' },
  { path: path.join(__dirname, 'data', 'TRS_Shooting.csv'), name: 'teams_regular_shooting' },
  { path: path.join(__dirname, 'data', 'TRS_Advanced.csv'), name: 'teams_regular_advanced1' },
  { path: path.join(__dirname, 'data', 'TRS_Opponent.csv'), name: 'teams_regular_advanced2' },
  { path: path.join(__dirname, 'data', 'TRS_FourFactors.csv'), name: 'teams_regular_four_factors' },

  // Teams Playoffs
  { path: path.join(__dirname, 'data', 'TPO_Totals.csv'), name: 'teams_playoffs_totals' },
  { path: path.join(__dirname, 'data', 'TPO_Averages.csv'), name: 'teams_playoffs_averages' },
  { path: path.join(__dirname, 'data', 'TPO_Shooting.csv'), name: 'teams_playoffs_shooting' },
  { path: path.join(__dirname, 'data', 'TPO_Advanced.csv'), name: 'teams_playoffs_advanced1' },
  { path: path.join(__dirname, 'data', 'TPO_Opponent.csv'), name: 'teams_playoffs_advanced2' },
  { path: path.join(__dirname, 'data', 'TPO_FourFactors.csv'), name: 'teams_playoffs_four_factors' },

  // New Files
  { path: path.join(__dirname, 'data', 'PLAYERS.csv'), name: 'players' }, // New PLAYERS.csv file
  { path: path.join(__dirname, 'data', 'TEAMS.csv'), name: 'teams' }     // New TEAMS.csv file
];

// Importiere alle CSV-Dateien
files.forEach(file => {
  importCSV(file.path)
    .then((data) => {
      console.log(`Data from ${file.name}:`, data); // Zeige die Daten an oder arbeite damit weiter
    })
    .catch(err => console.error(`Failed to import ${file.path}:`, err));
});
