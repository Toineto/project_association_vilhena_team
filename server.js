const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Serve static files from root directory with clean HTML URLs support
app.use(express.static(__dirname, {
  extensions: ['html']
}));

// Fallback to index.html for any remaining unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
