import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import DbService from '../../db/db.mjs';
import OrderModel from './db/models/Order.js';
import ConfigModel from './db/models/SpConfig.js';
import SellingPartnerService from './services/sellingPartner.js';

dotenv.config();

const ClientConnection = () => {
  // DB & Mongoose:
  const cloudUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  console.log('uri: ', cloudUri);
  mongoose
    .connect(cloudUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('DB is connected.');
      return Promise.resolve();
    })
    .catch((err) => {
      console.log('db error: ', err);
      return Promise.reject(err);
    });
};

// TODO:
// 1. Loop through all collection documents
// 2. For each document which contains the User Configurations for AWS, get Orders
// 3. For each Order, synchronize with DB

// get mongo collection: userconfigs
// const Client = DbService.ClientConnection();
// const userConfigs = Client.getCollection('userconfigs');
// get mongo collection: orders
// const collection = Client.getCollection('orders');

const query = {
  userId: '',
};
let userIds = [];
const queryAllOrders = async () => {
  ClientConnection();
  for await (const doc of OrderModel.find()) {
    // doc.name = "..."
    let payload = {};
    query.userId = doc.userId;
    userIds.push(doc.userId);
    // await doc.save();
    const userConfigs = await ConfigModel.find(query);
    console.log('user configs found: ', userConfigs);
    if (userConfigs && userConfigs.length > 0) {
      const { instance } = await SellingPartnerService.createUserInstance(userConfigs[0]);
      if (instance) {
        console.log('instance created: ', instance);
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
      console.log('ERROR: ', error);
      throw new Error(error);
    }
  }
};

queryAllOrders();
