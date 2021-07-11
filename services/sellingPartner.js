import SellingPartnerAPI from 'amazon-sp-api';

let awsConfigObject = {
  region:'na',
  refresh_token:'',
  access_token:'',
  // role_credentials: {
  //   id:'',
  //   secret:'',
  //   security_token:''
  // },
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
  async connectSimple() {
    try {
      // Use for Testing purposes <=> own instance created from .env file
      // Get Access Token using Refresh Token from self-auth method
      const sellingPartner = new SellingPartnerAPI({
        region: 'na',
        refresh_token: process.env.AWS_REFRESH_TOKEN,
        options: {
          auto_request_tokens: false,
        }
      });
      await sellingPartner.refreshAccessToken();
      await sellingPartner.refreshRoleCredentials();
      return {
        instance: sellingPartner,
        token: sellingPartner.access_token,
      };
    } catch (e) {
      console.log(e);
    }
  },
  async createUserInstance(configObject) {
    // Create User instance on the fly (~2s)
    awsConfigObject.refresh_token = configObject.awsRefreshToken;
    awsConfigObject.credentials.SELLING_PARTNER_APP_CLIENT_ID = configObject.sellingPartnerAppClientId;
    awsConfigObject.credentials.SELLING_PARTNER_APP_CLIENT_SECRET = configObject.sellingPartnerAppClientSecret;
    awsConfigObject.credentials.AWS_ACCESS_KEY_ID = configObject.awsSellingPartnerAccessKeyId;
    awsConfigObject.credentials.AWS_SECRET_ACCESS_KEY = configObject.awsSellingPartnerSecretAccessKey;
    awsConfigObject.credentials.AWS_SELLING_PARTNER_ROLE = configObject.awsSellingPartnerRole;
    const { credentials } = awsConfigObject;
    const sellingPartner = new SellingPartnerAPI({
      region: 'na',
      refresh_token: configObject.awsRefreshToken,
      credentials,
      options: {
        auto_request_tokens: false,
      },
    });
    try {
      await sellingPartner.refreshAccessToken();
      console.log('instance before passing: ', sellingPartner);
      await sellingPartner.refreshRoleCredentials();
    } catch (e) {
      console.log('error creating: ', e);
    }
    return {
      instance: sellingPartner,
      token: sellingPartner.access_token,
    };
  },
  // region Orders functions
  async getOrdersList(arg) {
    let instance = {};
    if (arg) instance = {...arg};
    else {
      const connection = await this.connectSimple();
      instance = connection.instance;
    }
    return new Promise((resolve, reject) => {
      instance.callAPI({
        operation: 'getOrders',
        endpoint: 'orders',
        query: {
          MarketplaceIds: [process.env.AWS_MARKETPLACE_ID],
          CreatedAfter: '2013-10-05T14:48:00.000Z'
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
            markeplaceIds: [process.env.AWS_MARKETPLACE_ID],
            createdBefore: queryParams.endDate,
            createdAfter: queryParams.startDate
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
  // endregion Orders functions
  getInventorySummaries(instance) {
    // GET /fba/inventory/v1/summaries
    return new Promise((resolve, reject) => {
      instance.callAPI({
        operation: 'getInventorySummaries',
        endpoint: 'fbaInventory',
        query: {
          granularityType: 'Marketplace',
          marketplaceIds: [process.env.AWS_MARKETPLACE_ID],
          granularityId: process.env.AWS_MARKETPLACE_ID
        }
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },
  // region General
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
  // endregion General
};
