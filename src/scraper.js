const axios = require('axios');
const cheerio = require('cheerio');
const { storeScrapedData } = require('./data');
const { healthPlans } = require('../config/urls');
const { extractPolicyData } = require('../utils/helpers');

async function scrapeHealthPolicy(url, healthPlanName) {
    try {
        const allPolicyData = []; // Array to collect all policy data

        for (let j = 65; j <= 90; j++) {
            const Url = url + String.fromCharCode(j);
            const response = await axios.get(Url);
            const $ = cheerio.load(response.data);
            const policyData = await extractPolicyData($); // Utilize helper function to extract data
            allPolicyData.push(policyData); // Collect policy data
        }

        // Once all policy data is collected, store it
        await storeScrapedData(allPolicyData, healthPlanName);
        console.log(`Data stored for ${healthPlanName}`);
    } catch (error) {
        console.error(`Error scraping ${healthPlanName}: ${error.message}`);
    }
}


async function scrapeAllHealthPlans() {
    try {
        for (const plan of healthPlans) {
            await scrapeHealthPolicy(plan.url, plan.name);
        }

        console.log('Scraping completed for all health plans');
    } catch (error) {
        console.error('Error scraping all health plans:', error.message);
    }
}


scrapeAllHealthPlans();
