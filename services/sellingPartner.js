export default {
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
