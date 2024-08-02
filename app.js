const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/testGUI/index.html'));
});

app.post('/save-html', async (req, res) => {
    const htmlContent = req.body.htmlContent;
    const filePath = path.join(__dirname, 'public', '/testGUI/exports/plot-container.html');

    fs.writeFileSync(filePath, htmlContent);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
    await browser.close();

    res.download(filePath, 'plot-container.html', (err) => {
        if (err) {
            res.status(500).send('Error downloading the file');
        }
    });
});

app.post('/save-png', async (req, res) => {
    const htmlContent = req.body.htmlContent;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pngPath = path.join(__dirname, 'public', '/testGUI/exports/plot.png');
    await page.screenshot({ path: pngPath, fullPage: true });
    await browser.close();

    res.download(pngPath, 'plot.png', (err) => {
        if (err) {
            res.status(500).send('Error downloading the file');
        }
    });
});

app.post('/save-json', (req, res) => {
    const jsonContent = req.body.jsonContent;

    if (typeof jsonContent !== 'string') {
        return res.status(400).json({ message: 'Invalid JSON content' });
    }

    const jsonPath = path.join(__dirname, 'public', 'testGUI', 'exports', 'plot.json');

    fs.writeFile(jsonPath, jsonContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return res.status(500).json({ message: 'Failed to save JSON file' });
        }
        
        res.download(jsonPath, 'plot.json', (err) => {
            if (err) {
                res.status(500).send('Error downloading the file');
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});