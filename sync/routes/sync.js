const { syncRating, deleteIncomplete } = require('../controllers/sync');
const express = require('express');
const router = express.Router();

router.get('/rating', syncRating);

router.get('/delete', deleteIncomplete);

module.exports = router;
