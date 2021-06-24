import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const configSchema = mongoose.Schema({
  sellingPartnerAppClientId: {
    type: String,
    required: [true, 'Some info is missing: SELLING_PARTNER_APP_CLIENT_ID'],
  },
  sellingPartnerAppClientSecret: {
    type: String,
    required: [true, 'Some info is missing: SELLING_PARTNER_APP_CLIENT_SECRET'],
  },
  awsSellingPartnerAccessKeyId: {
    type: String,
    required: [true, 'Some info is missing: AWS_SELLING_PARTNER_ACCESS_KEY_ID'],
  },
  awsSellingPartnerSecretAccessKey: {
    type: String,
    required: [true, 'Some info is missing: AWS_SELLING_PARTNER_SECRET_ACCESS_KEY_ID'],
  },
  awsSellingPartnerRole: {
    type: String,
    required: [true, 'Some info is missing: AWS_SELLING_PARTNER_ROLE'],
  },
  awsRefreshToken: {
    type: String,
    required: [true, 'Some info is missing: AWS_REFRESH_TOKEN'],
  },
  userId: {
    type: String,
    required: [true, 'No user selected.'],
  },
});

configSchema.statics.findAndUpdate = async function(body) {
  const userId = ObjectId(body.userId);
  console.log('body for model: ', userId);
  const doc = await UserConfig.findByIdAndUpdate(userId, body, {
    upsert: true,
    new: true,
  });
  if (!doc) {
    throw new Error({ error: 'No User Found.' });
  }
  return doc;
};

configSchema.statics.findOne = async function(body) {
  // const filter = { userId };
  const id = ObjectId(body.id);
  const doc = await UserConfig.find(id);
  return doc;
};

const UserConfig = mongoose.model('UserConfig', configSchema);
export default UserConfig;
