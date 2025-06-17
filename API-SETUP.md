# API Setup Guide

This guide explains how to set up the Anthropic Claude API for smart workout recommendations.

## Current Production Setup

**The app is already deployed and ready to use:**
- **Live App**: https://evangstav.github.io/redesigned-fishstick/4-weeks.html
- **API Proxy**: https://redesigned-fishstick-production.up.railway.app
- **Status**: Fully functional - just add your Claude API key in the app settings

## Solution 1: Local Proxy Server (Recommended for Development)

### Setup Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the proxy server:**

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3001`

3. **Open your fitness app:**
   Open `4-weeks.html` in your browser. The app is now configured to use the local proxy server.

### How it works

- The proxy server runs on your local machine
- It forwards API requests to Anthropic while adding proper CORS headers
- Your API key stays secure on your local machine
- The proxy server also exposes `/api/data/:id` endpoints for optional cloud
  backups used by the app's data sync feature

## Solution 2: Serverless Function (Recommended for Production)

### Netlify Functions

1. **Create `netlify/functions/anthropic-proxy.js`:**

   ```javascript
   exports.handler = async (event, context) => {
     if (event.httpMethod !== 'POST') {
       return { statusCode: 405, body: 'Method Not Allowed' };
     }

     try {
       const response = await fetch('https://api.anthropic.com/v1/messages', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'x-api-key': event.headers['x-api-key'],
           'anthropic-version': event.headers['anthropic-version'] || '2023-06-01'
         },
         body: event.body
       });

       const data = await response.json();
       return {
         statusCode: response.status,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify(data)
       };
     } catch (error) {
       return {
         statusCode: 500,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify({ error: 'Proxy error' })
       };
     }
   };
   ```

2. **Update the proxy URL in `4-weeks.html`:**

   ```javascript
   const proxyUrl = 'https://your-site.netlify.app/.netlify/functions/anthropic-proxy';
   ```

## Solution 3: Railway Deployment (Current Production Setup)

### Railway Setup Steps

1. **Connect GitHub Repository:**
   - Go to [Railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Railway auto-detects `proxy-server.js` and `package.json`

2. **Environment Variables:**
   - No environment variables needed (API key provided by client)
   - Railway automatically assigns a public domain

3. **Deployment:**
   - Pushes to main branch auto-deploy
   - Railway URL: `https://[project-name]-production.up.railway.app`
   - Update this URL in `4-weeks.html`

### Current Configuration

The app is currently configured to use:
```javascript
const proxyUrl = 'https://redesigned-fishstick-production.up.railway.app/api/anthropic';
```

### Vercel Functions

1. **Create `api/anthropic-proxy.js`:**

   ```javascript
   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

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
       res.status(response.status).json(data);
     } catch (error) {
       res.status(500).json({ error: 'Proxy error' });
     }
   }
   ```

2. **Update the proxy URL in `4-weeks.html`:**

   ```javascript
   const proxyUrl = 'https://your-site.vercel.app/api/anthropic-proxy';
   ```

## Troubleshooting

### "Failed to fetch" or CORS errors

- Ensure the proxy server is running (`npm start`)
- Check that the proxy URL in the HTML matches your server port
- Verify your API key is correctly entered

### API key errors

- Get your API key from [Anthropic Console](https://console.anthropic.com/)
- Ensure the key starts with `sk-ant-`
- Check that the key has sufficient credits

### Rate limiting

- Anthropic has rate limits on API usage
- Wait a few minutes and try again
- Consider upgrading your API plan for higher limits

## Getting Your Claude API Key

1. **Sign up for Anthropic Claude API:**
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Create an account and verify your identity
   - Add payment method (API usage is pay-per-use)

2. **Generate API Key:**
   - Navigate to API Keys section
   - Create new key (starts with `sk-ant-`)
   - Copy the key immediately (it won't be shown again)

3. **Add to App:**
   - Open the live app or your local version
   - Go to "Settings & e1RMs" tab
   - Paste your API key in the Claude API Key field
   - Test the connection using the "Test API Key" button

## Smart Recommendations Features

With the API key configured, you'll have access to:
- **Program Structure Following**: AI follows proper workout sequence
- **Detailed Performance Analysis**: Considers your recent workout performance
- **Personalized Recommendations**: Based on energy, stress, soreness, and time available
- **Auto-Progression Suggestions**: Weight adjustments based on RPE patterns
- **Equipment Adaptations**: Exercise substitutions for available equipment

## Security Notes

- **Never commit your API key** to version control
- The proxy server doesn't store or log API keys
- The app stores your API key in browser localStorage (local device only)
- API requests are made server-to-server (proxy to Anthropic)
- Your workout data never leaves your browser

