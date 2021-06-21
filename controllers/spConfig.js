import Config from '../db/models/SpConfig.js';

export default {
  async saveUserConfig(req, res) {
    try {
      const doc = await Config.findByIdAndUpdate(req.body.configObject);
      res.status(200).json({
        message: 'Data Saved Successfully.',
        data: doc,
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async getUserConfig(req, res) {
    try {
      const data = await Config.findOne(req.body.userId);
      if (doc) res.status(200).json({ data });
      res.status(500).json({ message: 'Not Found.' });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};
