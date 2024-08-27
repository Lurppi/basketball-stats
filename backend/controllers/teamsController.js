// backend/controllers/teamsController.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getTeamsData = (req, res) => {
    const { type, category } = req.params;
    let filePath;

    // Bestimmen des Pfades basierend auf Kategorie und Typ
    if (type === 'Regular') {
        switch (category) {
            case 'Totals':
                filePath = path.join(__dirname, '../data/TRS_Totals.csv');
                break;
            case 'Averages':
                filePath = path.join(__dirname, '../data/TRS_Averages.csv');
                break;
            case 'Shooting':
                filePath = path.join(__dirname, '../data/TRS_Shooting.csv');
                break;
            case 'Opponent':
                filePath = path.join(__dirname, '../data/TRS_Opponent.csv');
                break;
            case 'Advanced':
                filePath = path.join(__dirname, '../data/TRS_Advanced.csv');
                break;
            case 'FourFactors':
                filePath = path.join(__dirname, '../data/TRS_FourFactors.csv');
                break;
            default:
                return res.status(400).send('Invalid category');
        }
    } else if (type === 'Playoffs') {
        switch (category) {
            case 'Totals':
                filePath = path.join(__dirname, '../data/TPO_Totals.csv');
                break;
            case 'Averages':
                filePath = path.join(__dirname, '../data/TPO_Averages.csv');
                break;
            case 'Shooting':
                filePath = path.join(__dirname, '../data/TPO_Shooting.csv');
                break;
            case 'Opponent':
                filePath = path.join(__dirname, '../data/TPO_Opponent.csv'); // Korrigierter Pfad
                break;
            case 'Advanced':
                filePath = path.join(__dirname, '../data/TPO_Advanced.csv'); // Korrigierter Pfad
                break;
            case 'FourFactors':
                filePath = path.join(__dirname, '../data/TPO_FourFactors.csv');
                break;
            default:
                return res.status(400).send('Invalid category');
        }
    } else {
        return res.status(400).send('Invalid type');
    }

    // Überprüfen, ob die Datei existiert
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send(`File not found: ${filePath}`);
        }

        // Datei lesen
        const results = [];
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
    getTeamsData,
};
