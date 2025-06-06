const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for Anthropic API
app.post('/api/anthropic', async (req, res) => {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': req.headers['x-api-key'],
                'anthropic-version': req.headers['anthropic-version'] || '2023-06-01'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy server error' });
    }
});

// Save user data file
app.post('/api/data/:id', (req, res) => {
    const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), err => {
        if (err) {
            console.error('Save error:', err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json({ status: 'ok' });
    });
});

// Load user data file
app.get('/api/data/:id', (req, res) => {
    const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ error: 'Data not found' });
        }
        try {
            const json = JSON.parse(data);
            res.json(json);
        } catch (e) {
            res.status(500).json({ error: 'Corrupted data' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`CORS proxy server running on http://localhost:${PORT}`);
    console.log('Use this URL in your frontend: http://localhost:3001/api/anthropic');
    console.log('Data sync endpoints available at http://localhost:3001/api/data/:id');
});