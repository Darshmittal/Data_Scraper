const cheerio = require('cheerio');
const axios = require('axios');

async function extractFinalData(href) {
    try {
        const response = await axios.get(href);
        const $ = cheerio.load(response.data);

        // Extract title
        const title = $('div > h1 > strong').text().trim() + ' ' + $('div > h1').contents().filter(function() {
            return this.nodeType === 3;
        }).text().trim();

        // Extract effective date
        const effectiveDate = $('strong:contains("Effective Date")').next('p').text().trim();

        // Extract last reviewed date
        const lastReviewed = $('strong:contains("Last Reviewed")').next('p').text().trim();

        // Extract original document reference
        const originalDocument = $('strong:contains("Original Document")').next('p').find('a').attr('href');

        // Extract indications
        const indications = extractSectionData($, 'Indications');

        // Extract contraindications
        const contraindications = extractSectionData($, 'Contraindications');

        // Construct an object with the extracted data
        const extractedData = {
            title: title,
            effectiveDate: effectiveDate,
            lastReviewed: lastReviewed,
            originalDocument: originalDocument,
            indications: indications,
            contraindications: contraindications
        };

        return extractedData;
    } catch (error) {
        console.error("Error fetching data from URL:", href);
        console.error("Error message:", error.message);
        return null; // Return null to handle error case
    }
}

function extractSectionData($, sectionTitle) {
    const sectionData = [];
    
    // Find the section title
    const section = $(`h4:contains("${sectionTitle}")`).parent();

    // Find all questions in the section
    const questions = section.find('span').filter((index, element) => {
        return $(element).text().trim().startsWith('(');
    });

    // Loop through each question and extract its options
    questions.each((index, question) => {
        const questionText = $(question).text().trim();
        const options = [];

        // Find the radio buttons associated with this question
        const radioButtons = $(question).closest('.ant-form-item').find('input[type="radio"]');

        // Extract options from radio buttons
        radioButtons.each((index, radioButton) => {
            const optionText = $(radioButton).parent().next('span').text().trim(); // Adjusted this line
            options.push(optionText);
        });

        // Store question and options in an object
        const questionData = {
            question: questionText,
            options: options
        };

        // Push question data to the sectionData array
        sectionData.push(questionData);
    });

    return sectionData;
}

module.exports = { extractFinalData };




async function extractPolicyData($) {
    const extractedData = [];

    // Select all links within specific div
    const links = $('div.ant-col.ant-col-20.css-16x4oug a');

    // Extract href attribute values from the selected links
    const hrefValues = links.map((index, element) => $(element).attr('href')).get();

    // Create an array to store promises for data extraction
    const promises = [];

    // Iterate over each href value and extract data
    for (const href of hrefValues) {
        // Push each promise returned by extractFinalData into the promises array
        promises.push(extractFinalData('https://genhealth.ai' + href));
    }

    // Wait for all promises to resolve using Promise.all
    const data = await Promise.all(promises);

    // Filter out any null or undefined values from the data array
    const filteredData = data.filter(item => item);
    console.log(filteredData);

    // Return the filtered data
    return filteredData;
}



module.exports = { extractPolicyData };



// async function extractFinalData(href) {
//     // const policyData = {};
//     // policyData.title = {};

//     try {
//         const response = await axios.get(href);
//         const $ = cheerio.load(response.data);
//         // console.log($)
//         // const $ = cheerio.load(yourHTMLString); // Load your HTML string into Cheerio
//         // const strongText = $('div strong').text().trim();

// // Extract text within the <h1> tag
// $('div strong').each((index, element) => {
//     // Extract text content of each <strong> tag
//     const strongText = $(element).text().trim();
//     // const h1Text = $('div h1').text().trim();
    
//     // Print or do whatever you want with the extracted text
//     // console.log("Strong Text:", strongText);
//     // console.log("H1 Text:", h1Text);
// });



//         // const strongText = $('div strong').text(); // Extract text within the <strong> tag inside <div>
//         // console.log(`strong ${strongText}`);
        
//         // const policyData = extractPolicyData($); // Utilize helper function to extract data
//         // await storeScrapedData(policyData, healthPlanName);
//         // console.log(`healthPlanName ${healthPlanName}`);
//         // console.log(`link ${healthPlanName}`);
//         } catch (error) {
//             console.log(`hi`);
//         // console.error(`Error scraping ${healthPlanName}: ${error.message}`);
//     }

// }


// function extractPolicyData($) {
//   const policyData = {};

  
//   // Scraping logic to extract required data
// //   policyData.title = $('title').text();

//   // Assuming $ contains the HTML content you provided

//     // Select all <a> tags within <div> elements with class "ant-row"
//     // const links = $('div.ant-row.ant-row-space-between.ant-row-middle.css-16x4oug');
//     const links = $(`div.ant-col.ant-col-20.css-16x4oug a`);
//     // console.log(`links ${links}`);
//     // Extract href attribute values from the selected <a> tags
//     const hrefValues = links.map((index, element) => $(element).attr('href')).get();
//     // console.log
//     const finalHrefValue = 'https://genhealth.ai' + hrefValues;
//     // console.log(typeof finalHrefValue);
//     // console.log(`href ${finalHrefValue}`);

//     // console.log($)
//     // extractFinalData(finalHrefValue); // Utilize helper function to extract data
//     // await storeScrapedData(policyData, healthPlanName);
//     // console.log(`healthPlanName ${healthPlanName}`);
//     // console.log(`link ${healthPlanName}`);
//        console.log(finalHrefValue);

  
// //   // Example of extracting more data, modify as needed
// //   policyData.procedureName = $('.procedure-name').text();
// //   policyData.code = $('.procedure-code').text();
// //   policyData.codeDescription = $('.code-description').text();
// //   policyData.healthInsurancePlanName = $('.insurance-plan').text();
// //   policyData.lineOfBusiness = $('.line-of-business').text();
// //   policyData.effectiveDate = $('.effective-date').text();
// //   policyData.originalDocument = $('.original-document').attr('href');
// //   policyData.indications = {
// //     question: $('.indications-question').text(),
// //     answerOptions: $('.indications-answer-options').text()
// //   };
// //   policyData.counterindications = {
// //     question: $('.counterindications-question').text(),
// //     answerOptions: $('.counterindications-answer-options').text()
// //   };
// //   policyData.rules = {
// //     question: $('.rules-question').text(),
// //     requiredAnswer: $('.required-answer').text()
// //   };

//   return PolicyData;
// }


