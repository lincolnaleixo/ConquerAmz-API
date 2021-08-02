import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OrderModel from './db/models/Order.js';
import ConfigModel from './db/models/SpConfig.js';
import SellingPartnerService from './services/sellingPartner.js';

dotenv.config();

// Connect to DB & Mongoose:
const ClientConnection = () => {
  const cloudUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  return new Promise((resolve, reject) => {
    mongoose
      .connect(cloudUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log('DB is connected.');
        return resolve();
      })
      .catch((err) => {
        console.log('db error: ', err);
        return reject(err);
      });
  });
};

const query = {
  userId: '',
};

const queryAllOrders = async () => {
  await ClientConnection();
  for await (const config of ConfigModel.find()) {
    let payload = {};
    query.userId = config.userId;
    if (config) {
      const { instance } = await SellingPartnerService.createUserInstance(config);
      if (instance) {
        const orders = await SellingPartnerService.getOrdersList(instance);
        if (orders && orders.length > 0) {
          payload = {
            userId: doc.userId,
            awsOrders: orders,
          };
        }
      }
    }
    try {
      const doc = await OrderModel.findOneAndUpdate(payload);
      if (doc) {
        console.log('ORDERS SYNCED!');
        return true;
      }
    } catch (error) {
      console.log('ERROR SYNCING ORDERS: ', error);
      throw new Error(error);
    }
  }
};

queryAllOrders();
