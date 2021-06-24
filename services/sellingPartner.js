import SellingPartnerAPI from 'amazon-sp-api';

let awsConfigObject = {
  region:'na',
  refresh_token:'',
  access_token:'',
  role_credentials: {
    id:'',
    secret:'',
    security_token:''
  },
  credentials:{
    SELLING_PARTNER_APP_CLIENT_ID:'',
    SELLING_PARTNER_APP_CLIENT_SECRET:'',
    AWS_ACCESS_KEY_ID:'',
    AWS_SECRET_ACCESS_KEY:'',
    AWS_SELLING_PARTNER_ROLE:''
  },
  options: {
    auto_request_tokens: false,
  },
};

export default {
  async createUserInstance(configObject) {
    awsConfigObject.refresh_token = configObject.awsRefreshToken;
    awsConfigObject.credentials.SELLING_PARTNER_APP_CLIENT_ID = configObject.sellingPartnerAppClientId;
    awsConfigObject.credentials.SELLING_PARTNER_APP_CLIENT_SECRET = configObject.sellingPartnerAppClientSecret;
    awsConfigObject.credentials.AWS_ACCESS_KEY_ID = configObject.awsSellingPartnerAccessKeyId;
    awsConfigObject.credentials.AWS_SECRET_ACCESS_KEY = configObject.awsSellingPartnerSecretAccessKey;
    awsConfigObject.credentials.AWS_SELLING_PARTNER_ROLE = configObject.awsSellingPartnerRole;
    const sellingPartner = new SellingPartnerAPI({
      region: 'na',
      refresh_token: awsConfigObject.refresh_token,
      credentials: { ...awsConfigObject.credentials },
      options: {
        auto_request_tokens: false,
      },
    });
    await sellingPartner.refreshAccessToken();
    console.log('access token: ', sellingPartner.access_token);
    return sellingPartner.access_token;
  },
  getOrdersList(instance, marketplaceIds) {
    return new Promise((resolve, reject) => {
      instance.callAPI({
        operation: 'getOrders',
        endpoint: 'orders',
        query: {
          MarkeplaceIds: ['A1PA6795UKMFR9'],
        },
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },
  getOrdersListWithFilter(instance, marketplaceIds, queryParams) {
    if (queryParams) {
      return new Promise((resolve, reject) => {
        instance.callAPI({
          operation: 'getOrders',
          endpoint: 'orders',
          query: {
            markeplaceIds: [marketplaceIds],
            postedBefore: queryParams.endDate,
            postedAfter: queryParams.startDate
          },
        })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
      });
    }
    return this.getOrdersList(instance, marketplaceIds);
  },
  getOrderById(instance, orderId) {
    return new Promise((resolve, reject) => {
      instance.callAPI({
        operation: 'getOrder',
        endpoint: 'orders',
        path: {
          orderId: orderId,
        },
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getInventoryList() {},
  async testMarketplaceParticipations(instance) {
    let res = null;
    try {
      res = await instance.callAPI({
        operation: 'getMarketplaceParticipations',
        endpoint: 'sellers',
      });
      return res;
    } catch (e) {
      return e;
    }
  },
  getWithApiPath(instance, apiPath) {
    // to be used for unsupported/newly added endpoints
    // can replicate for other methods other than GET. Simply pass the newly added API path as a param:
    return new Promise((resolve, reject) => {
      instance.callAPI({
        api_path: apiPath,
        method: 'GET',
        query: {
          markeplaceIds: [process.env.AWS_MARKETPLACE_ID],
        }
      })
    });
  },
};
