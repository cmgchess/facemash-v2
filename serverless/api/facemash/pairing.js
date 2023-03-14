import { connectToDatabase } from '../../lib/database';
import { v4 as uuidv4 } from 'uuid';
import { allowCors } from '../../middleware/cors';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const PLAYER_COLLECTION = process.env.PLAYER_COLLECTION;
const MATCH_COLLECTION = process.env.MATCH_COLLECTION;

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).json({ message: 'Route not found' });
  }
  try {
    const db = await connectToDatabase(MONGO_URL, DB_NAME);
    const random = await db
      .collection(PLAYER_COLLECTION)
      .aggregate([{ $sample: { size: 2 } }])
      .toArray();
    const mapped = random.map(({ id, name, img }) => ({ id, name, img }));
    const match = uuidv4();
    const matchObj = { match, p1: mapped[0].id, p2: mapped[1].id };
    const savedMatch = await db
      .collection(MATCH_COLLECTION)
      .insertOne(matchObj);
    const pairing = { match, p1: mapped[0], p2: mapped[1] };
    return res.send(pairing);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = allowCors(handler);
