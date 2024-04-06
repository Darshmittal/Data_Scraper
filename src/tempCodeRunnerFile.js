const cheerio = require('cheerio');

// HTML content
const htmlContent = `<form class="ant-form ant-form-vertical css-16x4oug"><h3>ADAMTS13 Assay for TTP</h3><h4>Indications</h4><div style="z-index: 0;"><div class="row"><div class="col"><div class="ant-form-item css-16x4oug"><div class="ant-row ant-form-item-row css-16x4oug"><div class="ant-col ant-form-item-control css-16x4oug"><div class="ant-form-item-control-input"><div class="ant-form-item-control-input-content"><span>(950863) Is the ADAMTS13 assay being used for assessing prognosis in persons with thrombotic thrombocytopenic purpura (TTP)?</span>&nbsp;<span type="button" class="text-primary" style="cursor: pointer; margin-left: 0.5rem;"></span><br><div class="ant-radio-group ant-radio-group-outline css-16x4oug"><label class="ant-radio-button-wrapper ant-radio-button-wrapper-in-form-item css-16x4oug"><span class="ant-radio-button"><input class="ant-radio-button-input" type="radio" value="Yes"><span class="ant-radio-button-inner"></span></span><span>Yes</span></label><label class="ant-radio-button-wrapper ant-radio-button-wrapper-in-form-item css-16x4oug"><span class="ant-radio-button"><input class="ant-radio-button-input" type="radio" value="No"><span class="ant-radio-button-inner"></span></span><span>No</span></label><label class="ant-radio-button-wrapper ant-radio-button-wrapper-in-form-item css-16x4oug"><span class="ant-radio-button"><input class="ant-radio-button-input" type="radio" value="NA"><span class="ant-radio-button-inner"></span></span><span>NA</span></label></div></div></div></div></div></div></div></div></div><br><h4>Contraindications</h4><div style="z-index: 0;"><div class="ant-form-item css-16x4oug"><div class="ant-row ant-form-item-row css-16x4oug"><div class="ant-col ant-form-item-control css-16x4oug"><div class="ant-form-item-control-input"><div class="ant-form-item-control-input-content"><span class="text-reset">(950864) Is the ADAMTS13 assay being used for experimental and investigational indications such as biomarker for various diseases and risk assessments other than TTP?</span>&nbsp;<span type="button" class="text-primary" style="cursor: pointer; margin-left: 0.5rem;"></span><br><div class="ant-radio-group ant-radio-group-outline css-16x4oug"><label class="ant-radio-button-wrapper ant-radio-button-wrapper-in-form-item css-16x4oug"><span class="ant-radio-button"><input class="ant-radio-button-input" type="radio" value="Yes"><span class="ant-radio-button-inner"></span></span><span>Yes</span></label><label class="ant-radio-button-wrapper ant-radio-button-wrapper-in-form-item css-16x4oug"><span class="ant-radio-button"><input class="ant-radio-button-input" type="radio" value="No"><span class="ant-radio-button-inner"></span></span><span>No</span></label><label class="ant-radio-button-wrapper ant-radio-button-wrapper-in-form-item css-16x4oug"><span class="ant-radio-button"><input class="ant-radio-button-input" type="radio" value="NA"><span class="ant-radio-button-inner"></span></span><span>NA</span></label></div></div></div></div></div></div></div></form>`;
// Load HTML content using Cheerio
const $ = cheerio.load(htmlContent);

// Function to extract question and options
function extractSectionData(sectionTitle) {
    const sectionData = [];
    
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



// Extract data for "Indications" section
const indicationsData = extractSectionData('Indications');
console.log('Indications:', indicationsData);

// Extract data for "Contraindications" section
const contraindicationsData = extractSectionData('Contraindications');
console.log('Contraindications:', contraindicationsData);
