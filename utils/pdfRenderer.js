const { convert, info } = require('pdf-poppler');
const path = require('path');
const fs = require('fs').promises;

async function getPdfPageCount(pdfPath) {
  try {
    await fs.access(pdfPath);
    const pdfInfo = await info(pdfPath);
    return pdfInfo.pages;
  } catch (error) {
    throw new Error(`Failed to get PDF page count: ${error.message}`);
  }
}

async function getRandomPdfPage(pdfPath) {
  const pageCount = await getPdfPageCount(pdfPath);
  return Math.floor(Math.random() * pageCount) + 1;
}

async function renderPdfPageAsImage(pdfPath) {
  try {
    // Verify PDF exists
    await fs.access(pdfPath);

    const pageCount = await getPdfPageCount(pdfPath);
    console.log(`PDF has ${pageCount} pages`);
    
    // Get a random page number
    const randomPage = await getRandomPdfPage(pdfPath);
    console.log(`Selected random page: ${randomPage}`);

    const outputImagePath = path.join(__dirname, "../temp_pdf_images", `${path.basename(pdfPath, path.extname(pdfPath))}_page_${randomPage}.png`);
    
    // Parse output path
    const outputDir = path.dirname(outputImagePath);
    const outputName = path.basename(outputImagePath, path.extname(outputImagePath));
    const outputExt = path.extname(outputImagePath).slice(1) || 'png';
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Configure conversion options
    const options = {
      format: outputExt, // png, jpeg, etc.
      out_dir: outputDir,
      out_prefix: outputName,
      page: randomPage, // Specific page to convert
    };
    
    // Convert the PDF page to image
    await convert(pdfPath, options);
    
    const generatedFile = path.join(outputDir, `${outputName}-${randomPage}.${outputExt}`);
    
    // Check if generated file exists and rename it
    try {
      await fs.access(generatedFile);
      await fs.rename(generatedFile, outputImagePath);
    } catch (err) {
      throw new Error(`Generated image not found at ${generatedFile}`);
    }
    
    console.log(`Successfully rendered page ${randomPage} to ${outputImagePath}`);
    return { content: `<img src="data:image/${outputExt};base64,${await fs.readFile(outputImagePath, { encoding: 'base64' })}" alt="PDF Page ${randomPage}"/>`,
             filename: path.basename(pdfPath),
             pageNumber: randomPage };
  } catch (error) {
    throw new Error(`Failed to render PDF page: ${error.message}`);
  }
}

module.exports = { renderPdfPageAsImage };