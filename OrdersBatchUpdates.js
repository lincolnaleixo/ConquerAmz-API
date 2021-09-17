import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OrderModel from './db/models/Order.js';
import ConfigModel from './db/models/SpConfig.js';
import SellingPartnerService from './services/sellingPartner.js';
import DbService from './db/db.mjs';

dotenv.config();

const query = {
  userId: '',
};

const queryAllOrders = async () => {
  await DbService.ClientConnection();
  const orders = await ConfigModel.find();
  for await (const [idx, config] of orders.entries()) {
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
      }
    } catch (error) {
      console.log('ERROR SYNCING ORDERS: ', error);
      throw new Error(error);
    }
    if (idx === orders.length - 1) {
      console.log('ALL ORDERS SYNCED!');
      await DbService.CloseCurrentClient();
      return true;
    }
  }
};

queryAllOrders();
