import db from './db.mjs';

export default {
  query(collection, queryParam) {
    return new Promise((resolve, reject) => {
      db.ClientConnection.collection(collection)
        .find(queryParam)
        .toArray((err, res) => {
          if (err) reject(err);
          console.log(result);
          resolve(result);
        });
    });
  },
};
