const express = require('express');
const cors = require('cors');
const app = express();
const playersRoutes = require('./routes/players');
const teamsRoutes = require('./routes/teams');
const homeRoutes = require('./routes/home');

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
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Erlaubte Methoden
  allowedHeaders: ['Content-Type', 'Authorization'], // Erlaubte Header
  optionsSuccessStatus: 200, // Für legacy browser support
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));  // <- Dies stellt sicher, dass Preflight-Anfragen korrekt beantwortet werden

// Routes
app.use('/api/players', playersRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/home', homeRoutes);

// Default route for root path
app.get('/', (req, res) => {
  res.send('Welcome to the Basketball Stats API');
});

// Error handling for 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err.stack);
  res.status(500).send('Internal Server Error');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
