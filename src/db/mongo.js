const { MongoClient } = require('mongodb');
// Connection URI
const uri = 'mongodb://localhost:27017';

const connectionList = [];

/**
 * @returns {Promise<MongoClient>}
 */
const createConnection = async () => {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  connectionList.push(client);
  await client.connect();
  await client.db("admin").command({ ping: 2 });
  return client;
};

const closeConnections = async () => {
  for (const connection of connectionList) {
    try {
      await connection.close();
    } catch (error) {

    }
  }
};

module.exports = {
  createConnection,
  closeConnections,
};
