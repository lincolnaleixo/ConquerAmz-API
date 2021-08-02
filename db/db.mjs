import mongoose from 'mongoose';

const ClientConnection = () => {
  // DB & Mongoose:
  const cloudUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  mongoose
    .connect(cloudUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('DB is connected.')
    })
    .catch((err) => {
      console.log('db error: ', err);
    });
};

const CloseCurrentClient = () => {
  return mongoose.disconnect();
};

const models = {
  ClientConnection,
  CloseCurrentClient,
};
export default models;