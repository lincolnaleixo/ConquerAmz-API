import mongoose from 'mongoose';
import DbService from '../../db/db.mjs';

const ObjectId = mongoose.Types.ObjectId;

const inventorySchema = mongoose.Schema({
  userId: { type: [ObjectId], required: true },
  inventorySummaries: { type: Array, required: true },
}, { strict: false });

inventorySchema.statics.getInventories = async function (uid) {
  const id = ObjectId(uid);
  const docs = await Inventory.find({ userId: id });
  return docs;
};

inventorySchema.statics.findAndUpdate = async function (body) {
  const userId = ObjectId(body.userId);
  const doc = await Inventory.findByIdAndUpdate(userId, body, {
    upsert: true,
    new: true,
  });
  if (!doc) throw new Error('Inventory not found');
  return doc;
};

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
