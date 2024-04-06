const path = require('path');

// Define the path to the scraped_data.json file
const scrapedDataFilePath = path.join(__dirname, '../data/scraped_data.json');

// Export the path
module.exports = { scrapedDataFilePath };
