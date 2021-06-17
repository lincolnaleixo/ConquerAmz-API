import mongoose from 'mongoose';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import bodyParser from 'body-parser';
import jsonwebtoken from 'jsonwebtoken';

export default {
  initMiddleware() {
    const jwtOptions = {
      userModelName: 'User',
      jwtExpiresIn: 7 * 24 * 60 * 60,
    };
    
    mongoose.Promise = global.Promise;
    const UserSchema = new mongoose.Schema();
    // instantiate schema from 'passport':
    UserSchema.plugin(passportLocalMongoose);
    // connect to DB...
    const database = mongoose.connect(cloudUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }, (err) => {
      if (err) console.log('error: ', err);
      else console.log('connected successfully with DB.');
    });
    
    const User = database.model(jwtOptions.userModelName, UserSchema);
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    const jsonParser = bodyParser.json();
    
    const generateToken = username => {
      return jsonwebtoken.sign({ username }, jwtOptions.jwtSecret, {
        expiresIn: jwtOptions.expiresIn,
      });
    };
    
    const registerUser = (req, res) => {
      User.register(new User({
        username: req.body.username,
      }), req.body.password, (error) => {
        res.sendStatus(error.status);
      });
    };
    
    const loginUser = (req, res) => res.send(generateToken(req.user.username));
    
    const refreshUser = (req, res) => res.send(generateToken(req.user.username));
    
    const userValidator = (req, res, next) => {
      User.findOne({ username: req.user.username }, (error, user) => {
        if (error || !user) res.sendStatus(400);
        else return next();
      });
    }
    
    const jwtProtector = [
      (req, res, next) => {
        jwtValidator(req, res, (err) => {
          if (err && err.name === 'UnauthorizedError') res.sendStatus(401);
          else next(error);
        });
      },
      userValidator,
    ];
    return {
      registerHandler: [jsonParser, registerUser],
      loginHandler: [
        jsonParser,
        passport.initialize(),
        passport.authenticate('local'),
        loginUser,
      ],
      refreshHandler: [jwtProtector, refreshUser],
      jwtProtector,
    }
  },
};