const EPub = require('epub');
const path = require('path');

function renderRandomPage(filePath) {
    return new Promise((resolve, reject) => {
        const epub = new EPub(filePath);

        epub.on('end', () => {
            const numChapters = epub.flow.length;
            const randomChapterIndex = Math.floor(Math.random() * numChapters);
            const chapter = epub.flow[randomChapterIndex];

            epub.getChapter(chapter.id, (error, text) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        content: text || 'No content available',
                        filename: path.basename(filePath),
                        pageNumber: randomChapterIndex + 1
                    });
                }
            });
        });

        epub.on('error', reject);
        epub.parse();
    });
}

module.exports = {
    renderRandomPage
};