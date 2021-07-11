import mongoose from 'mongoose';
import DbService from '../../db/db.mjs';

const ObjectId = mongoose.Types.ObjectId;

const orderSchema = mongoose.Schema({}, { strict: false });

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
    // res = await Order.where('_id', req.body.userId).update(updateDoc, function (err, count) {
    //   console.log('updated with query!');
    // });
    console.log('result: ', res);
    return res;
  } catch (error) {
    console.log('error: ', error);
  } finally {
    await connection.CloseCurrentClient();
  }
};

orderSchema.statics.findOrders = async function(body) {
  const id = ObjectId(body.id);
  const doc = await Order.find(id);
  return doc;
};

const Order = mongoose.model('Order', orderSchema);
export default Order;
