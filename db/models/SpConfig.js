import { config } from 'dotenv';
import mongoose from 'mongoose';

const configSchema = mongoose.Schema({
  sellingParnterAppClientId: {
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
  awsSellingPartnerSecretAccessKeyId: {
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

configSchema.statics.findOneAndUpdate = async function(body) {
  const filter = { userId: body.userId };
  const doc = await Config.findOneAndUpdate(filter, body, {
    upsert: true,
    new: true,
  });
  return doc;
};

configSchema.statics.findOne = async function(userId) {
  const filter = { userId };
  const doc = await Config.find(filter);
  return doc;
};

const Config = mongoose.model('UserConfig', configSchema);
export default Config;
