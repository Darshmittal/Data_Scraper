const fs = require('fs');

// Define the path to the scraped_data.json file
const scrapedDataFilePath = __dirname + '/../data/scraped_data.json';

async function storeScrapedData(data, healthPlanName) {
  try {
    let scrapedData = {};

    // Check if the scraped_data.json file exists
    if (fs.existsSync(scrapedDataFilePath)) {
      // Read the file only if it is not empty
      const fileContent = fs.readFileSync(scrapedDataFilePath, 'utf-8');
      scrapedData = fileContent ? JSON.parse(fileContent) : {};
    }

    // Update the scraped data with the new data
    scrapedData[healthPlanName] = scrapedData[healthPlanName] || [];
    scrapedData[healthPlanName] = scrapedData[healthPlanName].concat(data);

    // Write the updated data back to the scraped_data.json file
    fs.writeFileSync(scrapedDataFilePath, JSON.stringify(scrapedData, null, 2));
    console.log(`Data stored for ${healthPlanName}`);
  } catch (error) {
    console.error(`Error storing data for ${healthPlanName}: ${error.message}`);
  }
}

module.exports = { storeScrapedData };
