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
      const { instance, token } = sellingPartnerService.createUserInstance(req.body.instance);
      console.log('inventories access token: ', token);
      const response = await sellingPartnerService.getInventorySummaries(instance);
      console.log('inv. response: ', res);
      res.json({ data: response }, 200);
    } catch (error) {
      console.error('inv. error: ', error);
      res.status(500).json({ error });
    }
  },
}
