const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const syncRouter = require('./routes/sync');

app.get('/', (req, res) => {
  res.send('Sync Server is running...');
});

app.use('/sync', syncRouter);

const port = process.env.PORT || 8001;
const server = app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);

module.exports = server;