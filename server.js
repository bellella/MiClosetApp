// proxy-server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(express.json());

// app.use(cors({
//   origin: 'http://localhost:8081',   // Expo dev 서버 origin
//   credentials: true,                 // 필요 시
// }));

app.use(cors());

app.post('/shopify', async (req, res) => {
  const r = await fetch('https://miicloset.myshopify.com/api/2024-04/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '051a89c6384586f7b96f243ec4515804',
    },
    body: JSON.stringify(req.body),
  });
  const data = await r.json();

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.send(data);
});

app.listen(4000, () => console.log('Proxy listening on port 4000'));
