# API Setup Guide

This guide explains how to resolve the browser security limitation (CORS) error when using the Anthropic Claude API.

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

## Security Notes

- **Never commit your API key** to version control
- The local proxy keeps your API key secure on your machine
- For production, consider environment variables for API keys
- The app stores your API key in browser localStorage (local only)

