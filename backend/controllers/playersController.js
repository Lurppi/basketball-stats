fs.createReadStream(filePath)
  .pipe(csv({ separator: ';' }))  // Ensuring the separator is correct
  .on('headers', (csvHeaders) => {
    headers = csvHeaders.map(header => header.trim()); // Ensure headers are properly trimmed
  })
  .on('data', (row) => {
    const formattedData = {};

    headers.forEach((header, index) => {
      formattedData[header] = row[header] ? row[header].trim() : '';  // Process data with trim
    });

    // Log formatted data to see if SEASON_YEAR is coming through
    console.log("Row data:", formattedData);

    results.push(formattedData);
  })
  .on('end', () => {
    res.json(results);  // Send processed data to the front end
  })
  .on('error', (err) => {
    console.error(`Error reading the CSV file: ${err}`);
    res.status(500).send('Error reading the CSV file');
  });
