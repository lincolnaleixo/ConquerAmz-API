import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import SellingPartnerAPI from 'amazon-sp-api';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import userRoutes from './routes/users.js';
import DbService from './db/db.mjs';

dotenv.config();

// start Express app
const app = express();
const port = 3000;

// Add  cors middleware
app.use(cors());
// Add middleware for parsing JSON and urlencoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

DbService.ClientConnection();

// const ConnectSp = async () => {
//   try {
//     // Get Access Token using Refresh Token from self-auth method
//     const sellingPartner = new SellingPartnerAPI({
//       region: 'na',
//       refresh_token: process.env.AWS_REFRESH_TOKEN,
//       options: {
//         auto_request_tokens: false,
//       }
//     });
//     await sellingPartner.refreshAccessToken();
//     await sellingPartner.refreshRoleCredentials();
//     console.log('access token: ', sellingPartner.access_token);
//     // console.log('credentials: ', sellingPartner.role_credentials);
//   } catch (e) {
//     console.log(e);
//   }
// };

// ConnectSp();

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
});
