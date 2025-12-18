const express = require('express');
const path = require('path');
const ebookService = require('./services/ebookService');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    try {
        const { content, filename, pageNumber } = await ebookService.getRandomEbookPage();
        res.send(`
            <html>
                <head><title>Random Ebook Page</title></head>
                <body>
                    <h1>${filename} - Page ${pageNumber}</h1>
                    <div>${content}</div>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error loading ebook page');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});