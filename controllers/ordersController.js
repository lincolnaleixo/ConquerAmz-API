import OrderModel from '../db/models/Order.js';
import sellingPartnerService from '../services/sellingPartner.js';

export default {
  async getOrders(req, res) {
    // get list from DB cluster
    try {
      const data = await OrderModel.findOrders({ id: req.query.userId });
      if (data && data.length > 0) res.status(200).json({ data });
      else if (data && data.length === 0) res.status(200).json({ message: 'No data found.' });
      else res.status(400).json({ message: 'Bad Request.' });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async getOrdersAws(req, res) {
    try {
      let { instance, token} = await sellingPartnerService.createUserInstance(req.body.instance);
      console.log('user token: ', token);
      console.log('passed instance: ', instance);
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
      const doc = await OrderModel.findOneAndUpdate(req.body);
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
      // const { instance, token} = await sellingPartnerService.createUserInstance(req.body.instance);
      // console.log('user token: ', token);
      // const instance = await sellingPartnerService.connectSimple();
      const { Orders } = await sellingPartnerService.getOrdersList();
      console.log('received: ', res);
      const data = [...Orders];
      if (data && data.length > 0) res.status(200).json({ data });
      else if (data && data.length === 0) res.status(200).json({ message: 'No data found.' });
      else res.status(400).json({ message: 'Bad Request.' });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};
