// backend/server.js
const express = require('express');
const cors = require('cors'); 
const app = express();
const playersRoutes = require('./routes/players');
const teamsRoutes = require('./routes/teams'); // Hinzufügen der teamsRoutes
const homeRoutes = require('./routes/home'); // Hinzufügen der homeRoutes

app.use(cors());
app.use(express.json());
app.use('/api/players', playersRoutes);
app.use('/api/teams', teamsRoutes); // Registrieren der teamsRoutes
app.use('/api/home', homeRoutes); // Registrieren der homeRoutes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
