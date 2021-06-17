import UserModel from '../db/models/User.js';

export default {
  async registerNewUser(req, res) {
    try {
      const isUser = await UserModel.User.find({ email: req.body.email });
      if (isUser.length >=1) {
        return res.status(409).json({ message: "There's already a User with this email." });
      }
      const user = new UserModel.User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      const data = await user.save();
      const token = await user.generateAuthToken();
      res.status(201).json({ data, token });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      if (!user) {
        return res.status(401).json({
          error: 'Login failed! Check your credentials.',
        });
      }
      const token = await user.generateAuthToken();
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async getUserDetails(req, res) {
    await res.json(req.userData);
  },
};
