const fs = require('fs');
const path = require('path');
const pdfRenderer = require('../utils/pdfRenderer');
const epubRenderer = require('../utils/epubRenderer');

const EBOOKS_DIR = path.join(__dirname, '../ebooks');

async function getRandomEbookPage() {
    const files = fs.readdirSync(EBOOKS_DIR);
    const ebookFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(EBOOKS_DIR, ebookFile);

    if (ebookFile.endsWith('.pdf')) {
        return await pdfRenderer.renderRandomPage(filePath);
    } else if (ebookFile.endsWith('.epub')) {
        return await epubRenderer.renderRandomPage(filePath);
    } else {
        throw new Error('Unsupported file format');
    }
}

module.exports = {
    getRandomEbookPage
};