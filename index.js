import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import SellingPartnerAPI from 'amazon-sp-api';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import userRoutes from './routes/users.js';

dotenv.config();

// start Express app
const app = express();
const port = 3000;

// DB & Mongoose:
const containerUri = process.env.DB_CONTAINER_STRING;  // connection string for connecting to DB in container
const cloudUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const connectUri = process.env.NODE_ENV === 'container' ? containerUri : cloudUri;

mongoose
  .connect(cloudUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB is connected.')
  })
  .catch((err) => {
    console.log('db error: ', err);
  });


// Add  cors middleware
app.use(cors());
// Add middleware for parsing JSON and urlencoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

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
  // console.log('access token: ', sellingPartner.access_token);
  // console.log('credentials: ', sellingPartner.role_credentials);
} catch (e) {
  console.log(e);
}

app.get('/', (req, res) => {
  res.send('Hello from Selling-Partner-API!');
});

app.use('/api/user', userRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.send('Route not found');
  next(err);
});

app.listen(port, async () => {
  console.log(`App listening at ${port}`);
  // await closeDbConnection();
});
