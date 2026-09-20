const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Serve static files from root directory with clean HTML URLs support
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: ['index.html']
}));

// Clean URL support and safe routing
app.use((req, res, next) => {
  // Never return index.html for missing static assets (images, CSS, JS, fonts, etc.)
  if (path.extname(req.path)) {
    return res.status(404).send('Not found');
  }

  // Check if a corresponding .html file exists for clean URLs (e.g. /professor, /filial)
  const cleanPath = req.path.replace(/^\//, '').split('?')[0];
  if (cleanPath) {
    const candidate = path.join(__dirname, cleanPath + '.html');
    return res.sendFile(candidate, (err) => {
      if (err) {
        res.sendFile(path.join(__dirname, 'index.html'));
      }
    });
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

module.exports = app;
