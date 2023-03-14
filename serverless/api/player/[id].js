import { connectToDatabase } from '../../lib/database';
import { allowCors } from '../../middleware/cors';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const PLAYER_COLLECTION = process.env.PLAYER_COLLECTION;
const MATCH_COLLECTION = process.env.MATCH_COLLECTION;

const getWinLossCount = (matches, id) => {
  return matches.reduce(
    (acc, { p1, p2, winner }) => {
      if (p1 === id && winner === 'p1') {
        acc.wins[p2] = acc.wins[p2] || 0;
        acc.wins[p2] += 1;
        acc.winCount += 1;
      } else if (p2 === id && winner === 'p2') {
        acc.wins[p1] = acc.wins[p1] || 0;
        acc.wins[p1] += 1;
        acc.winCount += 1;
      } else if (p1 === id && winner === 'p2') {
        acc.loss[p2] = acc.loss[p2] || 0;
        acc.loss[p2] += 1;
        acc.lossCount += 1;
      } else if (p2 === id && winner === 'p1') {
        acc.loss[p1] = acc.loss[p1] || 0;
        acc.loss[p1] += 1;
        acc.lossCount += 1;
      }
      return acc;
    },
    { wins: {}, loss: {}, winCount: 0, lossCount: 0 }
  );
};

const getPlayer = async (db, playerId) => {
  return await db
    .collection(PLAYER_COLLECTION)
    .findOne(
      { id: playerId },
      { projection: { name: 1, id: 1, img: 1, rating: 1, currRank: 1, _id: 0 } }
    );
};

const getMatches = async (db, playerId) => {
  return await db
    .collection(MATCH_COLLECTION)
    .find({
      $or: [{ p1: playerId }, { p2: playerId }],
      winner: { $exists: true },
    })
    .toArray();
};

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).json({ message: 'Route not found' });
  }
  try {
    const db = await connectToDatabase(MONGO_URL, DB_NAME);
    const playerId = req?.query?.id;

    if (!playerId) return res.status(404).json({ message: 'ID not provided' });

    const player = await getPlayer(db, playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const matches = await getMatches(db, player.id);

    const { wins, loss, winCount, lossCount } = getWinLossCount(
      matches,
      player.id
    );
    const mostWins = Object.entries(wins).sort(([_, a], [__, b]) => b - a)?.[0];
    const mostLoss = Object.entries(loss).sort(([_, a], [__, b]) => b - a)?.[0];

    let bestWin;
    let worstLoss;
    if (mostWins)
      bestWin = { ...(await getPlayer(db, mostWins[0])), wins: mostWins[1] };
    if (mostLoss)
      worstLoss = {
        ...(await getPlayer(db, mostLoss[0])),
        losses: mostLoss[1],
      };

    return res
      .status(200)
      .json({ ...player, winCount, lossCount, bestWin, worstLoss });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = allowCors(handler);
