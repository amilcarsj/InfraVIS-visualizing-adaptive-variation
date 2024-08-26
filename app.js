require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined'));

// Custom CSP middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh https://cdnjs.cloudflare.com data:; " +
    "style-src 'self' 'unsafe-inline' https://esm.sh https://cdnjs.cloudflare.com; " +
    "img-src 'self' data:; " +
    "font-src 'self' https://cdnjs.cloudflare.com; " +
    "connect-src 'self' https://esm.sh https://raw.githubusercontent.com; " +
    "worker-src 'self' blob:;"
  );
  next();
});

// Other security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // We're using our custom CSP above
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/testGUI/index.html'));
});

app.post('/save-html', async (req, res) => {
  try {
    const htmlContent = req.body.htmlContent;
    const filePath = path.join(__dirname, 'public', '/testGUI/exports/plot-container.html');

    await fs.promises.writeFile(filePath, htmlContent);

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
    await browser.close();

    res.download(filePath, 'plot-container.html');
  } catch (error) {
    console.error('Error in /save-html:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/save-png', async (req, res) => {
  try {
    const htmlContent = req.body.htmlContent;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pngBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    res.contentType('image/png');
    res.send(pngBuffer);
  } catch (error) {
    console.error('Error in /save-png:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/save-json', (req, res) => {
  try {
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
      
      res.download(jsonPath, 'plot.json');
    });
  } catch (error) {
    console.error('Error in /save-json:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });