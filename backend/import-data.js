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
        db.serialize(() => {
          // Dynamische Tabellenerstellung basierend auf CSV-Daten
          const columns = Object.keys(results[0]).join(', ');
          const placeholders = Object.keys(results[0]).map(() => '?').join(', ');
          db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns})`);
          const stmt = db.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`);
          results.forEach(row => {
            const values = Object.values(row);
            stmt.run(values);
          });
          stmt.finalize();
          resolve();
        });
      })
      .on('error', reject);
  });
};

// Alle CSV-Dateien importieren
const files = [
  // Weekly Stats
  { path: path.join(__dirname, 'data', 'points-week.csv'), table: 'players_weekly' },
  { path: path.join(__dirname, 'data', 'rebounds-week.csv'), table: 'players_weekly' },
  { path: path.join(__dirname, 'data', 'assists-week.csv'), table: 'players_weekly' },
  { path: path.join(__dirname, 'data', 'steals-week.csv'), table: 'players_weekly' },
  { path: path.join(__dirname, 'data', 'blocks-week.csv'), table: 'players_weekly' },
  { path: path.join(__dirname, 'data', 'per-week.csv'), table: 'players_weekly' },

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
  { path: path.join(__dirname, 'data', 'TPO_FourFactors.csv'), table: 'teams_playoffs_four_factors' }
];

// Importiere alle CSV-Dateien
files.forEach(file => {
  importCSVToDB(file.path, file.table)
    .then(() => console.log(`Imported ${file.path} into ${file.table}`))
    .catch(err => console.error(`Failed to import ${file.path}:`, err));
});
