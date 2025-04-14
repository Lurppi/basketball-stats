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
      if (!res.headersSent) {
        return res.status(404).send(`File not found: ${filePath}`);
      }
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
        if (!res.headersSent) {
          return res.status(404).send('No season stats found');
        }
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

      // Rückgabedaten ohne Badges
      if (!res.headersSent) {
        res.json({
          seasonStats: selectedSeasonData
        });
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

// Funktion zur Vergabe der Badges basierend auf den definierten Kriterien
const assignBadges = (seasonData) => {
  let badges = [];

  // Funktion zum Protokollieren der vergebenen Badges in der Konsole
  const logBadge = (badgeName) => {
    console.log(`Player: ${seasonData.PLAYER}, PlayerID: ${seasonData.PlayerID}, Badge: ${badgeName}, Season: ${seasonData.SEASON_YEAR}`);
  };

  // Sharpshooter Badge
  if (parseFloat(seasonData['3P%']) > 33.0 && parseFloat(seasonData['3PAPG']) >= 4 && parseFloat(seasonData['3PA']) >= 20) {
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
  if (parseFloat(seasonData['ST%']) >= 2.5 && parseFloat(seasonData['STOP%']) >= 55.0 && parseFloat(seasonData['DFG%']) <= 42.0 && parseFloat(seasonData['DRTG_ADJ']) < 90) {
    badges.push("Lockdown Defender");
    logBadge("Lockdown Defender");
  }

  // Rim Protector Badge
  if (parseFloat(seasonData['BS%']) >= 3.5 && parseFloat(seasonData['DRTG_ADJ']) < 95) {
    badges.push("Rim Protector");
    logBadge("Rim Protector");
  }

  // Rebounding Machine Badge
  if (parseFloat(seasonData['ORB%']) >= 10.0 && parseFloat(seasonData['DRB%']) >= 15.0 && parseFloat(seasonData['REB%']) >= 12.5) {
    badges.push("Rebounding Machine");
  }

  // Playmaker Badge
  if (parseFloat(seasonData['AS_TO']) > 1.0 && parseFloat(seasonData['AS_RATE']) >= 20 && parseFloat(seasonData['AS_RATIO']) >= 7.0) {
    badges.push("Playmaker");
  }

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

// Neue Funktion: Suche nach dem besten Saison-Datensatz mit mindestens 50 Minuten gespielt
const getValidPlayerStats = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
  const { playerID } = req.params;

  if (!playerID) {
    return res.status(400).send('PlayerID is required');
  }

  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      if (!res.headersSent) {
        return res.status(404).send(`File not found: ${filePath}`);
      }
    }

    const stream = fs.createReadStream(filePath).pipe(csv({ separator: ';' }));

    stream.on('data', (row) => {
      const cleanedRow = {};
      for (let key in row) {
        const cleanedKey = key.replace(/\uFEFF/g, '').trim();
        cleanedRow[cleanedKey] = row[key].replace(/\uFEFF/g, '').trim();
      }

      if (cleanedRow.PlayerID === playerID && cleanedRow.SEASON_TYPE.trim().toUpperCase() === 'SEASON') {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      if (results.length === 0) {
        console.log(`No season stats found for player ${playerID}`);
        return res.json({
          seasonStats: null,
          badges: [] // Leeres Badge-Array, wenn kein gültiger Datensatz gefunden wurde
        });
      }

      // Filtere nach mindestens 50 Minuten gespielten Minuten
      const validResults = results.filter(row => parseFloat(row.MP) >= 50);

      if (validResults.length === 0) {
        return res.json({
          seasonStats: null,
          badges: [] // Leeres Badge-Array, wenn keine gültigen Datensätze vorhanden
        });
      }

      // Wenn mehrere Datensätze in einer Saison existieren, wähle den mit den meisten Minuten
      const groupedBySeason = {};
      validResults.forEach(row => {
        if (!groupedBySeason[row.SEASON_YEAR]) {
          groupedBySeason[row.SEASON_YEAR] = [];
        }
        groupedBySeason[row.SEASON_YEAR].push(row);
      });

      const selectedSeasonData = Object.values(groupedBySeason).map(seasonRows => {
        return seasonRows.reduce((prev, current) => (parseFloat(current.MP) > parseFloat(prev.MP) ? current : prev));
      });

      // Den besten Datensatz aus der letzten Saison finden
      selectedSeasonData.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));
      const bestSeasonData = selectedSeasonData[0];

      // Vergib die Badges für diesen Datensatz
      const badges = assignBadges(bestSeasonData);

      res.json({
        seasonStats: bestSeasonData,
        badges: badges
      });
    });

    stream.on('error', (err) => {
      console.error(`Error reading the CSV file: ${err}`);
      if (!res.headersSent) {
        res.status(500).send('Error reading the CSV file');
      }
    });
  });
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
      if (!res.headersSent) {
        return res.status(404).send(`File not found: ${filePath}`);
      }
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
        if (!res.headersSent) {
          return res.status(404).send('No stats found');
        }
      }

      results.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));

      if (!res.headersSent) {
        res.json(results); // Rückgabe aller gefilterten Datensätze
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
      if (!res.headersSent) {
        return res.status(404).send(`File not found: ${filePath}`);
      }
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

const getAllPlayers = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      if (!res.headersSent) {
        return res.status(404).send(`File not found: ${filePath}`);
      }
    }

    const stream = fs.createReadStream(filePath).pipe(csv({ separator: ';' }));

    stream.on('data', (row) => {
      const cleanedRow = {};
      for (let key in row) {
        const cleanedKey = key.replace(/\uFEFF/g, '').trim();
        cleanedRow[cleanedKey] = row[key].replace(/\uFEFF/g, '').trim();
      }

      // Filtere nur Spieler mit mindestens X gespielten Minuten ("MP") und Saison-Daten
      if (
        parseFloat(cleanedRow.MP) >= 50 &&
        cleanedRow.SEASON_TYPE.trim().toUpperCase() === 'PLAYOFFS'
      ) {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      if (results.length === 0) {
        console.log('No valid players found');
        return res.json([]);
      }

      // Ermittle die aktuellste Saison
      results.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));
      const latestSeasonYear = results[0].SEASON_YEAR;

      // Filtere nur die Spieler der aktuellsten Saison
      const filteredResults = results.filter((row) => row.SEASON_YEAR === latestSeasonYear);

      // Gib die Spieler zurück
      if (!res.headersSent) {
        res.json(filteredResults);
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

// Funktion zur Generierung der Sitemap
const generateSitemap = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
  const baseUrl = 'https://www.nbbl-stats.de/player/'; // sicherstellen, dass die URL konsistent ist

  const playerIDs = new Set(); // Set verwenden, um Duplikate zu vermeiden

  // CSV-Datei öffnen und Player-IDs sammeln
  fs.createReadStream(filePath)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      const playerID = row.PlayerID;
      if (playerID) {
        playerIDs.add(playerID); // Duplikate werden durch das Set automatisch entfernt
      }
    })
    .on('end', () => {
      let staticUrls = `
        <url>
          <loc>https://www.nbbl-stats.de/</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.00</priority>
        </url>
        <url>
          <loc>https://www.nbbl-stats.de/players</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1.00</priority>
        </url>
        <url>
          <loc>https://www.nbbl-stats.de/teams</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1.00</priority>
        </url>
        <url>
          <loc>https://www.nbbl-stats.de/teams/form</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1.00</priority>
        </url>
        <url>
          <loc>https://www.nbbl-stats.de/standings</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.80</priority>
        </url>
        <url>
          <loc>https://www.nbbl-stats.de/impressum</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>yearly</changefreq>
          <priority>0.50</priority>
        </url>
        <url>
          <loc>https://www.nbbl-stats.de/glossary</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>yearly</changefreq>
          <priority>0.50</priority>
        </url>
        <url>
          <loc>https://www.nbbl-stats.de/privacy-policy</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>yearly</changefreq>
          <priority>0.50</priority>
        </url>
      `;

      // Dynamische Player-URLs generieren, sortiert nach PlayerID
      const dynamicUrls = Array.from(playerIDs) // Set in Array umwandeln
        .sort() // IDs sortieren
        .map(
          (id) => `
        <url>
          <loc>${baseUrl}${id}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.80</priority>
        </url>`
        )
        .join('');

      // Sitemap-Inhalt kombinieren
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n
        ${staticUrls}\n
        ${dynamicUrls}\n
        </urlset>`;

      // XML-Antwort senden, wenn noch keine Header gesendet wurden
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(sitemapContent);
      }
    })
    .on('error', (err) => {
      console.error('Error generating sitemap:', err);
      if (!res.headersSent) {
        res.status(500).send('Error generating sitemap');
      }
    });
};

// Neue Funktion: Filtere Spieler-Daten nach Season Year
const getPlayersBySeason = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
  const { seasonYear } = req.params;

  if (!seasonYear) {
    return res.status(400).send('Season year is required');
  }

  const results = [];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      if (!res.headersSent) {
        return res.status(404).send(`File not found: ${filePath}`);
      }
    }

    const stream = fs.createReadStream(filePath).pipe(csv({ separator: ';' }));

    stream.on('data', (row) => {
      const cleanedRow = {};
      for (let key in row) {
        const cleanedKey = key.replace(/\uFEFF/g, '').trim();
        cleanedRow[cleanedKey] = row[key].replace(/\uFEFF/g, '').trim();
      }

      // Filtere nur die Zeilen, die zur ausgewählten Saison gehören
      if (cleanedRow.SEASON_YEAR === seasonYear && cleanedRow.SEASON_TYPE.trim().toUpperCase() === 'SEASON') {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      if (results.length === 0) {
        console.log(`No stats found for season ${seasonYear}`);
        if (!res.headersSent) {
          return res.status(404).send('No stats found for the selected season');
        }
      }

      // Rückgabe der gefilterten Daten zur ausgewählten Saison
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
  getValidPlayerStats,
  getPlayerStatsBySeasonType,
  generateSitemap,
  getPlayersBySeason,
  getAllPlayers,
};

