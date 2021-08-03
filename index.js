import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import SellingPartnerAPI from 'amazon-sp-api';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import inventoryRoutes from './routes/inventories.js';
import DbService from './db/db.mjs';
import schedule from 'node-schedule';
import childprocess from 'child_process';

dotenv.config();

// start Express app
const app = express();
const port = 3000;

// Add cors middleware
app.use(cors());
// Add middleware for parsing JSON and urlencoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

DbService.ClientConnection();

app.get('/', (req, res) => {
  res.send('Hello from Selling-Partner-API!');
});

app.use('/api/user', userRoutes);
app.use('/api', orderRoutes);
app.use('/api/inventories', inventoryRoutes);

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

// Schedule Orders job to run every 10 minutes
schedule.scheduleJob('*/10 * * * *', async () => {
  console.log('Selling-Partner-API is scheduling orders synchronization.');
  const job = childprocess.exec('node OrdersBatchUpdates.js',
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    }  
  );
  job.stdout.on('data', (data) => {
    console.log(`Orders stdout: ${data}`);
  });
  job.on('exit', (code) => {
    console.log(`Orders child process exited with code ${code}`);
  });
});

// Schedule Inventories job to run every 1 hour
schedule.scheduleJob('*/60 * * * *', async () => {
  console.log('Selling-Partner-API is scheduling inventories synchronization.');
  const job = childprocess.exec('node InventoriesBatchUpdates.js',
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    }  
  );
  job.stdout.on('data', (data) => {
    console.log(`Inventories stdout: ${data}`);
  });
  job.on('exit', (code) => {
    console.log(`Inventories child process exited with code ${code}`);
  });
});
