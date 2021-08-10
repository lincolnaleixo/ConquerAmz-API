import mongoose from 'mongoose';
import DbService from '../../db/db.mjs';

const ObjectId = mongoose.Types.ObjectId;

const orderSchema = mongoose.Schema({
  userId: { type: [ObjectId], required: true },
  awsOrders: { type: Array, required: true },
}, { strict: false });

orderSchema.statics.findAndUpdate = async function(body) {
  const userId = ObjectId(body.userId);
  const document = await Order.findByIdAndUpdate(userId, body, {
    upsert: true,
    new: true,
  });
  if (!document) throw new Error({ error: 'No entry found.' });
  return document;
};

orderSchema.statics.batchUpdate = async function(body) {
  const filter = { userId: body.userId };
  const connection = DbService.ClientConnection();
  const collection = connection.collection('orders');
  const updateDoc = req.body.awsOrders;
  let res = null;
  try {
    res = await collection.updateMany(filter, updateDoc);
    console.log('result: ', res);
    return res;
  } catch (error) {
    console.log('error: ', error);
  } finally {
    await connection.CloseCurrentClient();
  }
};

orderSchema.statics.findOrders = async function(uid) {
  const id = ObjectId(uid);
  const doc = await Order.find({ userId: id });
  return doc;
};

orderSchema.statics.findLatestOrders = async function(uid) {
  const id = ObjectId(uid);
  const size = 10;
  const doc = await Order.find({ userId: id }, null, { sort: { PurchaseDate: -1 } });
  const awsOrders = doc[0].awsOrders;
  return [...awsOrders].slice(0, size);  // return first 10 items
};

const Order = mongoose.model('Order', orderSchema);
export default Order;
