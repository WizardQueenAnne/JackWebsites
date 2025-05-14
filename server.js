// Simple Node.js server for static website hosting
// This can be used for platforms like Render, Heroku, etc.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Normalize URL by removing query string and trailing slash
    let url = req.url.split('?')[0];
    if (url.endsWith('/') && url.length > 1) url = url.slice(0, -1);
    if (url === '') url = '/';
    if (url === '/') url = '/index.html';
    
    // Handle clean URLs for terms and disclaimer
    if (url === '/terms') {
        url = '/terms.html';
    } else if (url === '/disclaimer') {
        url = '/disclaimer.html';
    }
    
    // Determine content type based on file extension
    const extname = path.extname(url);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }
    
    // Read the file
    fs.readFile(`.${url}`, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile('./index.html', (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
