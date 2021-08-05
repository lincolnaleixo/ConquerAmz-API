import OrderModel from '../db/models/Order.js';
import sellingPartnerService from '../services/sellingPartner.js';

export default {
  async getOrders(req, res) {
    // get list from DB cluster
    try {
      const data = await OrderModel.findOrders(req.query.userId);
      if (data && data.length > 0) res.status(200).json(data);
      else if (data && data.length === 0) res.status(200).json({ message: 'No data found.' });
      else res.status(400).json({ message: 'Bad Request.', data });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  async getOrdersAws(req, res) {
    try {
      let { instance, token} = await sellingPartnerService.createUserInstance(req.body.instance);
      const { Orders } = await sellingPartnerService.getOrdersList(instance);
      const data = [...Orders];
      if (data && data.length > 0) res.status(200).json({ data });
      else if (data && data.length === 0) res.status(200).json({ message: 'No data found.' });
      else res.status(400).json({ message: 'Bad Request.' });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async saveOrders(req, res) {
    try {
      const doc = await OrderModel.findAndUpdate(req.body);
      if (doc) {
        res.status(200).json({
          message: 'Data saved successfully.',
          data: doc,
        });
      } else {
        res.status(500).json({
          message: 'Something wrong happened :(',
          data: null,
        });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async manualSyncOrders(req, res) {
    try {
      const { Orders } = await sellingPartnerService.getOrdersList();
      const data = [...Orders];
      if (data && data.length > 0) {
        const doc = await OrderModel.findAndUpdate({
          userId: req.body.userId,
          awsOrders: data,
        });
        if (doc) res.status(200).json({ data });
        else res.status(500).json({ message: 'Something wrong happened :(' });
      }
      else if (data && data.length === 0) res.status(200).json({ message: 'No data found.' });
      else res.status(400).json({ message: 'Bad Request.' });
    } catch (error) {
      res.status(500).json(JSON.stringify(error));
    }
  }
}
