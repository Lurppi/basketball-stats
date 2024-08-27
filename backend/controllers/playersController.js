// backend/controllers/playersController.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getPlayersData = (req, res) => {
    const { type, category } = req.params;
    let filePath = path.join(__dirname, `../data/${type}_${category}.csv`);  // Dynamischer Pfad

    // Behandlung für spezifische 'Four Factors' Dateien
    if (category === 'FourFactors' && type === 'Regular') {
        filePath = path.join(__dirname, '../data/Regular_Four_Factors.csv');
    } else if (category === 'FourFactors' && type === 'Playoffs') {
        filePath = path.join(__dirname, '../data/Playoffs_Four_Factors.csv');
    }

    const results = [];

    // Überprüfen, ob die Datei existiert, bevor versucht wird, sie zu lesen
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send(`File not found: ${filePath}`);
        }

        // Datei lesen
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))  // Trennzeichen anpassen, falls notwendig
            .on('data', (data) => results.push(data))
            .on('end', () => {
                res.json(results);
            })
            .on('error', (err) => {
                console.error(`Error reading the CSV file: ${err}`);
                res.status(500).send('Error reading the CSV file');
            });
    });
};

module.exports = {
    getPlayersData,
};
