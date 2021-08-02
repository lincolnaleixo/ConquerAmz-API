import ConfigModel from '../db/models/SpConfig.js';
import sellingPartnerService from '../services/sellingPartner.js';

export default {
  async saveUserConfig(req, res) {
    try {
      const doc = await ConfigModel.findAndUpdate(req.body);
      if (doc) {
        res.status(200).json({
          message: 'Data Saved Successfully.',
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
  async getUserConfig(req, res) {
    try {
      const data = await ConfigModel.findOne({ id: req.query.userId });
      if (data && data.length > 0) res.status(200).json({ data });
      else if (data && data.length === 0) res.status(200).json({ message: 'User Not Found' });
      else res.status(400).json({ message: 'Bad Request.' });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
  async createUserInstance(req, res) {
    try {
      const { instance, token } = await sellingPartnerService.createUserInstance(req.body.instance);
      res.status(200).json({
        message: 'Started!',
        accessToken: token,
        instance
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Oops :(' });
    }
  },
};
