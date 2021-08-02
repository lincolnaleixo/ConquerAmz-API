import mongoose from 'mongoose';
import dotenv from 'dotenv';
import InventoryModel from './db/models/Inventory.js';
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

const queryAllInvs = async () => {
  await ClientConnection();
  for await (const config of ConfigModel.find()) {
    let payload = {};
    query.userId = config.userId;
    if (config) {
      const { instance } = await SellingPartnerService.createUserInstance(config);
      if (instance) {
        const data = await SellingPartnerService.getInventorySummaries(instance);
        const { inventorySummaries } = data;
        if (inventorySummaries && inventorySummaries.length > 0) {
          payload = {
            userId: config.userId,
            inventorySummaries,
          };
        }
      }
    }
    try {
      const doc = await InventoryModel.findAndUpdate(payload);
      if (doc) {
        console.log('INVENTORIES SYNCED!');
        return true;
      }
    } catch (error) {
      console.log('ERROR SYNCING INVENTORIES: ', error);
      throw new Error(error);
    }
  }
};

queryAllInvs();
