const mongo = require('mongodb');
const { MongoClient } = mongo;

const POOL_SIZE = 5; //process.env.IS_OFFLINE ? 1 : 50;
let cachedDb = null;

let connectToDatabase = (uri, dbName) => {
  if (cachedDb && cachedDb?.serverConfig?.isConnected()) {
    return Promise.resolve(cachedDb);
  }
  return MongoClient.connect(uri, {
    useNewUrlParser: true,
    poolSize: POOL_SIZE,
    useUnifiedTopology: true,
    w: 'majority',
    readConcern: 'local',
  }).then((client) => {
    cachedDb = client.db(dbName);
    return cachedDb;
  });
};

let getMongoIdForValue = (id) => {
  return new mongo.ObjectID(id);
};

let getMongoId = () => {
  return new mongo.ObjectID();
};

module.exports = {
  connectToDatabase: connectToDatabase,
  getMongoId: getMongoId,
  getMongoIdForValue: getMongoIdForValue,
};
