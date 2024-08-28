const express = require('express');
const cors = require('cors'); 
const app = express();
const playersRoutes = require('./routes/players');
const teamsRoutes = require('./routes/teams');
const homeRoutes = require('./routes/home');

// Middleware
app.use(cors());
app.use(express.json());

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
