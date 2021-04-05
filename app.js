require('express-async-errors');
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

process.on('uncaughtException', (error) => {
  console.log({ error: error.message, details: error.toString() });
});

const app = express();

// Setup CORS stuff
const corsOptions = {origin: process.env.ALLOWED_ORIGIN}
app.use(cors(corsOptions));

app.use('/', routes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Listening on port ${port}`));