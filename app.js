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
    "connect-src 'self' https://esm.sh https://raw.githubusercontent.com blob:; " +
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
    
    // Set content type to HTML
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename=plot-container.html');
    
    res.send(htmlContent);
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

    // Attempt to parse the incoming JSON to ensure it's valid
    let parsedJSON;
    try {
      parsedJSON = JSON.parse(jsonContent);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON format' });
    }

    // Convert the JSON format to Gosling-compatible format
    const goslingFormattedJSON = {
      arrangement: "vertical",
      views: parsedJSON.views.map(view => {
        return {
          layout: "linear",
          alignment: view.alignment || "stack",
          static: view.static || false,
          width: view.width,
          height: view.height,
          // Filter out tracks that do not have loaded data
          tracks: view.tracks
            .filter(track => track.data && track.data.url && track.data.type)  // Ensure data is loaded
            .map(track => ({
              data: track.data,
              mark: track.mark,
              x: track.x,
              xe: track.xe,
              y: track.y,
              stroke: track.stroke || { value: "black" },
              strokeWidth: track.strokeWidth || { value: 0.3 },
              style: track.style || { outlineWidth: 0 }
            }))
        };
      })
    };

    // Set content type to JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=plot.json');

    res.send(JSON.stringify(goslingFormattedJSON, null, 2));  // Ensure it is formatted nicely
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