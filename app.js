const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // Send the main .html file when the root URL is accessed
    res.sendFile(path.join(__dirname, 'public', '/testGUI/index.html'));
});

app.post('/save-and-render', async (req, res) => {
    const htmlContent = req.body.htmlContent;
    const filePath = path.join(__dirname, 'public', '/testGUI/exports/plot-container.html');

    // Save the HTML content to a file
    fs.writeFileSync(filePath, htmlContent);

    // Launch Puppeteer to render the file
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

    // Capture as PNG
    await page.screenshot({ path: path.join(__dirname, 'public', '/testGUI/exports/plot.png'), fullPage: true });

    // Capture as SVG
    const svgContent = await page.$eval('svg', svg => svg.outerHTML);
    fs.writeFileSync(path.join(__dirname, 'public', '/testGUI/exports/plot.svg'), svgContent);

    await browser.close();

    res.json({ message: 'Rendered successfully', png: 'plot.png', svg: 'plot.svg' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
