import InventoryModel from '../db/models/Inventory.js';
import sellingPartnerService from '../services/sellingPartner.js';

export default {
  async demoInventorySummaries(req, res) {
    try {
      const { instance, token } = await sellingPartnerService.connectSimple();
      console.log('inventories access token: ', token);
      const response = await sellingPartnerService.getInventorySummaries(instance);
      res.status(200).json({ data: response });
    } catch (error) {
      console.error('inv. error: ', error);
      res.status(500).json({ error });
    }
  },
  async getInventorySummaries(req, res) {
    try {
      const { instance } = sellingPartnerService.createUserInstance(req.body.instance);
      const { data } = await sellingPartnerService.getInventorySummaries(instance);
      const response = data.inventorySummaries;
      if (response) res.json({ data: response }, 200);
      else res.status(400);
    } catch (error) {
      console.error('inv. error: ', error);
      res.status(500).json({ error });
    }
  },
  async syncInventories(req, res) {
    try {
      const { instance } = sellingPartnerService.createUserInstance(req.body.instance);
      const inventorySummaries = await sellingPartnerService.getInventorySummaries(instance);
      console.log('gotten: ', inventorySummaries);
      const data = [...inventorySummaries];
      if (data && data.length > 0) {
        const doc = await InventoryModel.findAndUpdate({
          userId: req.body.userId,
          inventorySummaries: data,
        });
        if (doc) res.status(200).json({ data });
        else res.status(500).json({ message: 'Something wrong happened :(' });
      }
      else if (data && data.length === 0) res.status(200).json({ message: 'No data found.' });
      else res.status(400).json({ message: 'Bad Request.' });
    } catch (error) {
      res.status(500).json(JSON.stringify(error));
    }
  },
}
