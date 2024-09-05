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
        headers = csvHeaders.map(header => header.trim()); // Trim headers for cleanliness
      })
      .on('data', (row) => {
        const formattedData = {};

        headers.forEach((header) => {
          formattedData[header] = row[header] ? row[header].trim() : ''; // Trim and process data
        });

        // Log formatted row for debugging
        console.log("Row data:", formattedData);

        results.push(formattedData);
      })
      .on('end', () => {
        res.json(results); // Send the parsed results back to the client
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
