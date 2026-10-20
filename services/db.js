const { MongoClient } = require("mongodb");

// One client per process. On serverless platforms (Vercel) the module may be
// reused between requests, so the connection promise is cached globally.
let clientPromise = null;

const isMongoEnabled = () => Boolean(process.env.MONGODB_URI);

const getDb = async () => {
  if (!isMongoEnabled()) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI).connect().catch((error) => {
      clientPromise = null;
      throw error;
    });
  }
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "portfolio");
};

module.exports = { getDb, isMongoEnabled };
