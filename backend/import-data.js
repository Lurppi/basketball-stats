const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const db = new sqlite3.Database('./data.db');

// Helper-Funktion zum Importieren von CSV-Daten in eine SQLite-Tabelle
const importCSVToDB = (filePath, tableName) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (results.length === 0) {
          console.error(`No data found in ${filePath}`);
          return reject(new Error(`No data found in ${filePath}`));
        }

        db.serialize(() => {
          const columns = Object.keys(results[0]).map(col => `"${col}"`).join(', ');  // Escape column names
          const placeholders = Object.keys(results[0]).map(() => '?').join(', ');
          
          console.log(`Creating table if not exists: CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns})`);
          db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns})`, (err) => {
            if (err) {
              console.error(`Error creating table ${tableName}:`, err.message);
              return reject(err);
            }
          });

          const stmt = db.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`);
          
          results.forEach(row => {
            const values = Object.values(row);
            console.log(`Inserting into ${tableName}:`, values);
            stmt.run(values, (err) => {
              if (err) {
                console.error(`Error inserting into ${tableName}:`, err.message);
              }
            });
          });

          stmt.finalize((err) => {
            if (err) {
              console.error(`Error finalizing statement for ${tableName}:`, err.message);
              return reject(err);
            }
            resolve();
          });
        });
      })
      .on('error', (err) => {
        console.error(`Error reading CSV file ${filePath}:`, err.message);
        reject(err);
      });
  });
};

// Alle CSV-Dateien importieren
const files = [
  // Weekly Stats

  // Regular Season Stats
  { path: path.join(__dirname, 'data', 'points-regular.csv'), table: 'players_regular' },
  { path: path.join(__dirname, 'data', 'rebounds-regular.csv'), table: 'players_regular' },
  { path: path.join(__dirname, 'data', 'assists-regular.csv'), table: 'players_regular' },
  { path: path.join(__dirname, 'data', 'steals-regular.csv'), table: 'players_regular' },
  { path: path.join(__dirname, 'data', 'blocks-regular.csv'), table: 'players_regular' },
  { path: path.join(__dirname, 'data', 'per-regular.csv'), table: 'players_regular' },

  // Playoffs Stats
  { path: path.join(__dirname, 'data', 'points-playoffs.csv'), table: 'players_playoffs' },
  { path: path.join(__dirname, 'data', 'rebounds-playoffs.csv'), table: 'players_playoffs' },
  { path: path.join(__dirname, 'data', 'assists-playoffs.csv'), table: 'players_playoffs' },
  { path: path.join(__dirname, 'data', 'steals-playoffs.csv'), table: 'players_playoffs' },
  { path: path.join(__dirname, 'data', 'blocks-playoffs.csv'), table: 'players_playoffs' },
  { path: path.join(__dirname, 'data', 'per-playoffs.csv'), table: 'players_playoffs' },

  // Additional CSV files
  { path: path.join(__dirname, 'data', 'regular_totals.csv'), table: 'players_totals' },
  { path: path.join(__dirname, 'data', 'regular_averages.csv'), table: 'players_averages' },
  { path: path.join(__dirname, 'data', 'regular_shooting.csv'), table: 'players_shooting' },
  { path: path.join(__dirname, 'data', 'regular_advanced1.csv'), table: 'players_advanced1' },
  { path: path.join(__dirname, 'data', 'regular_advanced2.csv'), table: 'players_advanced2' },
  { path: path.join(__dirname, 'data', 'regular_four_factors.csv'), table: 'players_four_factors' },
  { path: path.join(__dirname, 'data', 'playoffs_totals.csv'), table: 'players_totals_playoffs' },
  { path: path.join(__dirname, 'data', 'playoffs_averages.csv'), table: 'players_averages_playoffs' },
  { path: path.join(__dirname, 'data', 'playoffs_shooting.csv'), table: 'players_shooting_playoffs' },
  { path: path.join(__dirname, 'data', 'playoffs_advanced1.csv'), table: 'players_advanced1_playoffs' },
  { path: path.join(__dirname, 'data', 'playoffs_advanced2.csv'), table: 'players_advanced2_playoffs' },
  { path: path.join(__dirname, 'data', 'playoffs_four_factors.csv'), table: 'players_four_factors_playoffs' },

  // Teams Regular Season
  { path: path.join(__dirname, 'data', 'TRS_Totals.csv'), table: 'teams_regular_totals' },
  { path: path.join(__dirname, 'data', 'TRS_Averages.csv'), table: 'teams_regular_averages' },
  { path: path.join(__dirname, 'data', 'TRS_Shooting.csv'), table: 'teams_regular_shooting' },
  { path: path.join(__dirname, 'data', 'TRS_Advanced.csv'), table: 'teams_regular_advanced1' },
  { path: path.join(__dirname, 'data', 'TRS_Opponent.csv'), table: 'teams_regular_advanced2' },
  { path: path.join(__dirname, 'data', 'TRS_FourFactors.csv'), table: 'teams_regular_four_factors' },

  // Teams Playoffs
  { path: path.join(__dirname, 'data', 'TPO_Totals.csv'), table: 'teams_playoffs_totals' },
  { path: path.join(__dirname, 'data', 'TPO_Averages.csv'), table: 'teams_playoffs_averages' },
  { path: path.join(__dirname, 'data', 'TPO_Shooting.csv'), table: 'teams_playoffs_shooting' },
  { path: path.join(__dirname, 'data', 'TPO_Advanced.csv'), table: 'teams_playoffs_advanced1' },
  { path: path.join(__dirname, 'data', 'TPO_Opponent.csv'), table: 'teams_playoffs_advanced2' },
  { path: path.join(__dirname, 'data', 'TPO_FourFactors.csv'), table: 'teams_playoffs_four_factors' },

  // New Files
  { path: path.join(__dirname, 'data', 'PLAYERS_1.csv'), table: 'players_1' },
  { path: path.join(__dirname, 'data', 'PLAYERS_PO.csv'), table: 'players_po' },
  { path: path.join(__dirname, 'data', 'PLAYERS_RS.csv'), table: 'players_rs' },
  { path: path.join(__dirname, 'data', 'TEAMS_PO.csv'), table: 'teams_po' },
  { path: path.join(__dirname, 'data', 'TEAMS_RS.csv'), table: 'teams_rs' }
];

// Importiere alle CSV-Dateien
files.forEach(file => {
  importCSVToDB(file.path, file.table)
    .then(() => console.log(`Imported ${file.path} into ${file.table}`))
    .catch(err => console.error(`Failed to import ${file.path}:`, err));
});
