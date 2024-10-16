import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const sitemapUrl = 'https://backend-sandy-rho.vercel.app/api/sitemap/sitemap.xml';

const fetchSitemap = async () => {
  try {
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }

    const sitemapData = await response.text();

    const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(filePath, sitemapData);
    console.log('Sitemap successfully saved to public/sitemap.xml');
  } catch (error) {
    console.error('Error fetching sitemap:', error);
  }
};

fetchSitemap();
