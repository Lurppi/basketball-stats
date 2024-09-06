const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getPlayersData = (req, res) => {
  const filePath = path.join(__dirname, '../data/PLAYERS.csv'); // Ensure correct path to your CSV file
  const results = [];
  let headers = [];

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send(`File not found: ${filePath}`);
    }

    // Read and process the CSV file
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))  // Ensure you're using the correct separator
      .on('headers', (csvHeaders) => {
        headers = csvHeaders.map(header => header.trim()); // Trim and store headers as is
        console.log("Headers from CSV:", headers); // Log the headers for debugging
      })
      .on('data', (row) => {
        const formattedData = {};

        headers.forEach((header) => {
          formattedData[header] = row[header] ? row[header] : ''; // Use raw data without trimming
        });

        // Ensure SEASON_YEAR is correctly handled
        if (!formattedData['SEASON_YEAR'] || formattedData['SEASON_YEAR'] === '') {
          console.warn("SEASON_YEAR missing or empty in row:", formattedData);
          formattedData['SEASON_YEAR'] = extractSeasonYearFromID(formattedData['ID']); // Fallback to ID
        }

        results.push(formattedData);
      })
      .on('end', () => {
        console.log("Results sent to frontend:", results); // Log all results for debugging
        res.json(results); // Send the parsed results back to the client
      })
      .on('error', (err) => {
        console.error(`Error reading the CSV file: ${err}`);
        res.status(500).send('Error reading the CSV file');
      });
  });
};

// Helper function to extract season year from ID
const extractSeasonYearFromID = (id) => {
  if (!id || typeof id !== 'string') return 'Unknown';
  const parts = id.split('_');
  return parts.length > 0 ? parts[0] : 'Unknown';
};

module.exports = {
  getPlayersData,
};
