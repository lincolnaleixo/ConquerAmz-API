import jwt from 'jsonwebtoken';

export default {
  async authenticateCalls(req, res, next) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      console.log('token: ', token);
      const decodedToken = jwt.verify(token, 'secret');
      req.userData = decodedToken;
      next();
    } catch (err) {
      return res.status(401).json({
        message: 'Unauthorized!',
      });
    }
  },
};
