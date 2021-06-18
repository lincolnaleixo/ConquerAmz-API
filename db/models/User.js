import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please include your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please include a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Please include a password.'],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// hash Password before saving user model:
userSchema.pre('save', async function(next) {
  const user = this;
  if (user && user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Generate Auth Token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
  }, "secret");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// search by email and password
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: 'Invalid credentials' });
  }
  const doPasswordMatch = await bcrypt.compare(password, user.password);
  if (!doPasswordMatch) throw new Error({ error: 'Invalid credentials.' });
  return user;
}


const User = mongoose.model('User', userSchema);
export default User;
