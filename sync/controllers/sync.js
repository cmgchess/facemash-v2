const { connectToDatabase } = require('../db');
const glicko2 = require('glicko2');
const algoliasearch = require('algoliasearch');
const { chunk } = require('lodash');

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const PLAYER_COLLECTION = process.env.PLAYER_COLLECTION;
const MATCH_COLLECTION = process.env.MATCH_COLLECTION;
const ALGOLIA_APP = process.env.ALGOLIA_APP;
const ALGOLIA_KEY = process.env.ALGOLIA_KEY;
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX;

const TAU = 0.5;
const SETTINGS = {
  tau: TAU,
  rating: 1500,
  rd: 350,
  vol: 0.06,
};

const connectToIndex = (appId, apiKey, index) => {
  const client = algoliasearch(appId, apiKey);
  return client.initIndex(index);
};

const addToIndex = async (records, index) => {
  try {
    await index.saveObjects(records);
  } catch (e) {
    console.error(e);
  }
};

const getAllRecords = async (db) => {
  try {
    const records = await db.collection(PLAYER_COLLECTION).find({}).toArray();
    return records;
  } catch (e) {
    console.error(e);
  }
};

const chunkedRecords = (records, chunkSize) => {
  const algoliaRecords = records.map(
    ({ id, name, img, rating, prevRank, currRank }) => {
      return {
        objectID: id,
        name,
        img,
        rating,
        prevRank,
        currRank,
      };
    }
  );
  return chunk(algoliaRecords, chunkSize);
};

const bulkUpdateCollection = async (db, entries) => {
  if (entries.length) {
    let col = db.collection(PLAYER_COLLECTION);
    let bulk = col.initializeUnorderedBulkOp();
    for (const entry of entries) {
      await bulk.find({ id: entry[0] }).updateOne({ $set: entry[1] });
    }
    return bulk.execute();
  } else {
    return 'None';
  }
};

const bulkUpdateRanked = async (db, entries) => {
  if (entries.length) {
    let col = db.collection(PLAYER_COLLECTION);
    let bulk = col.initializeUnorderedBulkOp();
    for (const entry of entries) {
      await bulk.find({ id: entry.id }).updateOne({ $set: entry });
    }
    return bulk.execute();
  } else {
    return 'None';
  }
};

const syncRating = async (req, res) => {
  const CHUNK_SIZE = 50;
  const ranking = new glicko2.Glicko2(SETTINGS);
  try {
    const db = await connectToDatabase(MONGO_URL, DB_NAME);
    const timeNow = Date.now();
    const oneDayBefore = timeNow - 24 * 60 * 60 * 1000;

    res.send({ message: 'Updating ratings' });

    const matches = await db
      .collection(MATCH_COLLECTION)
      .find({ timestamp: { $gte: oneDayBefore, $lt: timeNow } })
      .toArray();
    const playersSet = [...new Set(matches.flatMap((m) => [m.p1, m.p2]))];
    const players = await db
      .collection(PLAYER_COLLECTION)
      .find({ id: { $in: playersSet } })
      .toArray();
    const playerMap = players.reduce(
      (acc, { id, rating, deviation, sigma }) => {
        acc[id] = {
          rating,
          deviation,
          sigma,
          g: ranking.makePlayer(rating, deviation, sigma),
        };
        return acc;
      },
      {}
    );
    const matchArray = matches.map(({ p1, p2, winner }) => {
      const result = winner === 'p1' ? 1 : 0;
      return [playerMap[p1].g, playerMap[p2].g, result];
    });
    ranking.updateRatings(matchArray);
    const updatedRatings = Object.entries(playerMap).map(([k, v]) => {
      const rating = v.g.getRating();
      const deviation = v.g.getRd();
      const sigma = v.g.getVol();
      return [k, { rating, deviation, sigma }];
    });
    const result = await bulkUpdateCollection(db, updatedRatings);

    const allRecords = await getAllRecords(db);
    const sortedByRating = allRecords.sort((a, b) => b.rating - a.rating);
    const newRanked = sortedByRating.map((r, i) => ({ ...r, prevRank: r.currRank, currRank: i + 1 }));
    const resultRanked = await bulkUpdateRanked(db, newRanked);

    const algoliaIndex = connectToIndex(ALGOLIA_APP, ALGOLIA_KEY, ALGOLIA_INDEX);
    const chunks = chunkedRecords(newRanked, CHUNK_SIZE);
    for (const chunk of chunks) {
      await addToIndex(chunk, algoliaIndex);
    }
    return;
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const deleteIncomplete = async (req, res) => {
  try {
    const db = await connectToDatabase(MONGO_URL, DB_NAME);
    await db
      .collection(MATCH_COLLECTION)
      .deleteMany({ winner: { $exists: false } });
    return res.send({ message: 'Deleted unfinished matches' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = {
  syncRating,
  deleteIncomplete,
};
