const express = require('express');
const path = require('path'); // Add this line to import the path module
const app = express();

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    // Send the main .html file when the root URL is accessed
    res.sendFile(path.join(__dirname, 'public', '/testGUI/index.html'));
    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});