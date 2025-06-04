const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

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

app.listen(PORT, () => {
    console.log(`CORS proxy server running on http://localhost:${PORT}`);
    console.log('Use this URL in your frontend: http://localhost:3001/api/anthropic');
});