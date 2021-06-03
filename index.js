import MwsApi from 'amazon-mws';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// initiate Amazon MWS
const amazonMws = new MwsApi();
amazonMws.setApiKey(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

// start Express app
const app = express();
const port = 3000;

amazonMws.setResponseFormat('JSON');

app.get('/', (req, res) => {
  res.send('Hello from Selling-Partner-API!');
});

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
