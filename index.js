import express from 'express';
import dotenv from 'dotenv';
// import SellingPartnerAPI from 'amazon-sp-api';
import pkg from 'mongodb';

const { MongoClient } = pkg;

dotenv.config();

const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const uri = `mongodb+srv://eugenDb:${password}@cluster0.grdmy.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {
  if (err !== null) {
    console.log('connection error: ', err);
    return err;
  }
  const dbExample = client.db(`${dbName}`);
  console.log('collection: ', dbExample);
  client.close();
});

// start Express app
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.send('Hello from Selling-Partner-API!');
});

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
