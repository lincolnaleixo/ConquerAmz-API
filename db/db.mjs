import mongoose from 'mongoose';
import UserModel from './models/user.mjs';

const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const cloudUri = `mongodb+srv://eugenDb:${password}@cluster0.grdmy.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const containerUri = process.env.DB_CONTAINER_STRING;  // connection string for connecting to DB in container

export const connectionString = process.env.NODE_ENV === 'container' ? containerUri : cloudUri;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
}, (err) => {
  if (err) console.log('error: ', err);
  else console.log('connected successfully with DB.');
});

export const models = { UserModel };
