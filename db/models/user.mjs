import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
  },
);

schema.set('JSON', { virtuals: true });

export default schema;
