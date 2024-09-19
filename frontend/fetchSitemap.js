const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Pfad für den public-Ordner im Frontend
const publicFolder = path.join(__dirname, 'public');

// Funktion zum Abrufen der Sitemap von der Backend-API
async function fetchAndSaveSitemap() {
  try {
    // Abrufen der Sitemap von der Backend-API
    const response = await axios.get('https://backend-sandy-rho.vercel.app/api/sitemap/sitemap.xml');
    const sitemap = response.data;

    // Sicherstellen, dass der public-Ordner existiert
    if (!fs.existsSync(publicFolder)) {
      fs.mkdirSync(publicFolder);
    }

    // Sitemap in den public-Ordner speichern
    const sitemapPath = path.join(publicFolder, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
    console.log('Sitemap successfully saved to the public folder.');
  } catch (error) {
    console.error('Error fetching or saving sitemap:', error);
  }
}

fetchAndSaveSitemap();
