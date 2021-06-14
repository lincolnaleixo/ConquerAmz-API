import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import SellingPartnerAPI from 'amazon-sp-api';
// import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

try {
  // Get Access Token using Refresh Token from self-auth method
  const sellingPartner = new SellingPartnerAPI({
    region: 'na',
    refresh_token: process.env.AWS_REFRESH_TOKEN,
    options: {
      auto_request_tokens: false,
    }
  });
  await sellingPartner.refreshAccessToken();
  await sellingPartner.refreshRoleCredentials();
  // Test everything by getting some marketplace participants:
  const res = await sellingPartner.callAPI({
    operation: 'getMarketplaceParticipations',
    endpoint: 'sellers',
  });
  console.log('response from marketplace: ', res);
} catch (e) {
  console.log(e);
}

// start Express app
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello from Selling-Partner-API!');
});

app.use('api/v1/', userRoutes);

app.listen(port, async () => {
  console.log(`App listening at ${port}`);
  // await closeDbConnection();
});
