import mongoose from 'mongoose';
import dotenv from 'dotenv';
import InventoryModel from './db/models/Inventory.js';
import ConfigModel from './db/models/SpConfig.js';
import SellingPartnerService from './services/sellingPartner.js';
import DbService from './db/db.mjs';

dotenv.config();

const query = {
  userId: '',
};

const queryAllInvs = async () => {
  // await ClientConnection();
  await DbService.ClientConnection();
  const invs = await ConfigModel.find();

  for await (const [index, config] of invs.entries()) {
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
      }
    } catch (error) {
      console.log('ERROR SYNCING INVENTORIES: ', error);
      throw new Error(error);
    }

    if (index === invs.length - 1) {
      console.log('ALL INVENTORIES SYNCED!');
      await DbService.CloseCurrentClient();
      return true;
    }
  }
};

queryAllInvs();
