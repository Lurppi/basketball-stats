const getLastSeasonStats = (req, res) => {
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

      // Filter nach PlayerID und SEASON_TYPE = 'SEASON'
      if (cleanedRow.PlayerID === playerID && cleanedRow.SEASON_TYPE === 'SEASON') {
        results.push(cleanedRow); // Sammle alle SEASON-Einträge des Spielers
      }
    });

    stream.on('end', () => {
      if (results.length === 0) {
        return res.status(404).send('No season stats found');
      }

      // Sortiere nach SEASON_YEAR (neueste zuerst, z.B. 20232024 > 20222023)
      results.sort((a, b) => parseInt(b.SEASON_YEAR, 10) - parseInt(a.SEASON_YEAR, 10));

      // Nehmen wir das Jahr der neuesten Saison (aus den gefilterten Daten)
      const latestSeasonYear = results[0].SEASON_YEAR;

      // Filtere nach der neuesten Saison
      const latestSeasonEntries = results.filter(entry => entry.SEASON_YEAR === latestSeasonYear);

      // Falls der Spieler in JBBL und NBBL gespielt hat, vergleiche GP
      const jbblEntry = latestSeasonEntries.find(entry => entry.LEAGUE === 'JBBL');
      const nbblEntry = latestSeasonEntries.find(entry => entry.LEAGUE === 'NBBL');

      let bestEntry = null;

      if (jbblEntry && nbblEntry) {
        // Wähle den Eintrag mit den meisten GP (gespielte Spiele)
        bestEntry = jbblEntry.GP > nbblEntry.GP ? jbblEntry : nbblEntry;
      } else if (jbblEntry) {
        bestEntry = jbblEntry;
      } else if (nbblEntry) {
        bestEntry = nbblEntry;
      } else {
        bestEntry = latestSeasonEntries[0]; // Falls nur ein Eintrag vorhanden ist, nimm den ersten
      }

      // Rückgabe des ausgewählten Datensatzes
      if (!res.headersSent) {
        res.json(bestEntry);
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
  getLastSeasonStats, // Export der neuen Methode
};
