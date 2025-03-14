const express = require('express');
const cors = require('cors');
const path = require('path'); // Neu hinzugefügt für Dateipfade
const app = express();
const playersRoutes = require('./routes/players');
const teamsRoutes = require('./routes/teams');
const homeRoutes = require('./routes/home');
const formRoutes = require('./routes/form');
const playerDetailsRoutes = require('./routes/playerDetails'); // PlayerDetails-Route
const sitemapRoutes = require('./routes/sitemap');

// CORS configuration
const corsOptions = {
  origin: [
    'https://www.nbbl-stats.de',
    'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:5172',
    'https://frontend-iota-seven-93.vercel.app',
    'https://frontend-lurppis-projects.vercel.app'
  ],
  optionsSuccessStatus: 200,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Statisches Verzeichnis für den 'public'-Ordner (Neu hinzugefügt)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/players', playersRoutes); // Players Route
app.use('/api/teams', teamsRoutes); // Teams Route
app.use('/api/home', homeRoutes); // Home Route
app.use('/api/form', formRoutes); // Form Route
app.use('/api/playerdetails', playerDetailsRoutes); // PlayerDetails-Route
app.use('/api/sitemap', sitemapRoutes); 

// Default route for root path
app.get('/', (req, res) => {
  res.send('Welcome to the Basketball Stats API');
});

// Error handling for 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
