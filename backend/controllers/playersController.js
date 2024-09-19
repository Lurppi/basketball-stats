const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Konsolidierte Funktion: Suche nach dem besten Saison-Datensatz mit mindestens 50 Minuten gespielt
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

      if (cleanedRow.PlayerID === playerID && cleanedRow.SEASON_TYPE.trim().toUpperCase() === 'SEASON') {
        results.push(cleanedRow);
      }
    });

    stream.on('end', () => {
      if (results.length === 0) {
        console.log(`No season stats found for player ${playerID}`);
        return res.json({
          seasonStats: null
        });
      }

      // Filtere nach mindestens 50 gespielten Minuten
      const validResults = results.filter(row => parseFloat(row.MP) >= 50);

      if (validResults.length === 0) {
        return res.json({
          seasonStats: null
        });
      }

      // Gruppiere nach SEASON_YEAR und wähle die Saison mit den meisten Minuten
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

      // Sortiere die Daten und wähle den besten Saison-Datensatz
      selectedSeasonData.sort((a, b) => b.SEASON_YEAR.localeCompare(a.SEASON_YEAR));
      const bestSeasonData = selectedSeasonData[0];

      res.json({
        seasonStats: bestSeasonData
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

// Funktion zur Generierung der Sitemap
const generateSitemap = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv');
  const baseUrl = 'https://www.nbbl-stats.de/player/';

  let playerIDs = [];

  // CSV-Datei öffnen und Player-IDs sammeln
  fs.createReadStream(filePath)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      const playerID = row.PlayerID;
      if (playerID) {
        playerIDs.push(playerID);
      }
    })
    .on('end', () => {
      let staticUrls = `
              <url>
          <loc>https://www.nbbl-stats.de/</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.50</priority>
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

      // Dynamische Player-URLs generieren
      const dynamicUrls = playerIDs
        .map(
          (id) => `
        <url>
          <loc>${baseUrl}${id}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
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

module.exports = {
  getPlayersData,
  getPlayerSeasonStats,
  getPlayerStatsBySeasonType,
  generateSitemap
};

