const express = require('express');
const path = require('path');
const ebookService = require('./services/ebookService');
const e = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    try {
        const { content, filename, pageNumber } = await ebookService.getRandomEbookPage();
        res.send(`
            <html>
                <head><title>Random Ebook Page</title></head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
                <body>
                    <div class="container mt-5">
                        <h1>${path.basename(filename)} - Page ${pageNumber}</h1>
                        <div>${content}</div>
                    </div>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
                </body>
            </html>
        `);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error loading ebook page');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});