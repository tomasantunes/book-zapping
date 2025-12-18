const fs = require('fs');
const pdfParse = require('pdf-parse');

async function renderRandomPage(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const numPages = data.numpages;
    const randomPageNumber = Math.floor(Math.random() * numPages) + 1;
    const pageContent = data.text.split('\n\n')[randomPageNumber - 1];

    return {
        content: pageContent || 'No content available',
        filename: filePath.split('/').pop(),
        pageNumber: randomPageNumber
    };
}

module.exports = {
    renderRandomPage
};