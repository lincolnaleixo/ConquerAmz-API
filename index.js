import express from 'express';
import dotenv from 'dotenv';
// import SellingPartnerAPI from 'amazon-sp-api';
import mongoose from 'mongoose';

dotenv.config();

const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const uri = `mongodb+srv://eugenDb:${password}@cluster0.grdmy.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const containerUri = process.env.DB_CONTAINER_STRING;  // connection string for connecting to DB in container

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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  res.send('Hello from Selling-Partner-API!');
});

app.listen(port, async () => {
  console.log(`App listening at ${port}`);
  await closeDbConnection();
});
