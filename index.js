import express from 'express';
import dotenv from 'dotenv';
// import SellingPartnerAPI from 'amazon-sp-api';
import pkg from 'mongodb';
import mongoose from 'mongoose';

const { MongoClient } = pkg;

dotenv.config();

const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const uri = `mongodb+srv://eugenDb:${password}@cluster0.grdmy.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const closeDbConnection = async () => {
  console.log('closing db connection...');
  mongoose.connection.close();
};

mongoose.connect(uri, {
  useNewUrlParser: true,
}, (err) => {
  if (err) console.log('error: ', err);
  else console.log('connected successfully with DB.');
});

// start Express app
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.send('Hello from Selling-Partner-API!');
});

app.listen(port, async () => {
  console.log(`App listening at ${port}`);
  await closeDbConnection();
});
