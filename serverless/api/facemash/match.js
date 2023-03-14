import { connectToDatabase } from '../../lib/database';
import { allowCors } from '../../middleware/cors';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const MATCH_COLLECTION = process.env.MATCH_COLLECTION;

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'Route not found' });
  }
  try {
    const db = await connectToDatabase(MONGO_URL, DB_NAME);
    const { match, p1, p2, winner } = req.body;
    const savedMatch = await db.collection(MATCH_COLLECTION).findOne({ match });
    if (!savedMatch || savedMatch.p1 !== p1 || savedMatch.p2 !== p2) {
      return res.status(400).send({ message: 'Invalid match' });
    }
    if (savedMatch && savedMatch.winner) {
      return res.status(400).send({ message: 'Match already saved' });
    }
    const timestamp = Date.now();
    const result = await db
      .collection(MATCH_COLLECTION)
      .update({ match }, { $set: { winner, timestamp } });
    return res.send({ message: 'success' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = allowCors(handler);
