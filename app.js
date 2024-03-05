const express = require('express');
const app = express();

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    // Send the main .html file when the root URL is accessed
    res.sendFile(path.join(__dirname, 'public', '/GUI/krill_GUI.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});