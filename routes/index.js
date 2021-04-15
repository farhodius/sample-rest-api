const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('../app/middleware/auth');
const AppError = require('../app/errors/app.error');

router.use(bodyParser.json({}));

// Health check endpoint
router.get('/ping', (req, res) => {
  res.send('pong');
});

router.use('/authenticate', require('./authenticate'));

router.use('/api', [auth], require('./api'));

router.use('/files', [auth], require('./files'));

// Root route - not found response 
router.use('/', (req, res) => {
  res.status(404).json({ error: 'Resource not found.' });
});

// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof AppError) {
    console.log({ error: error.message, code: error.code });
    res.status(error.httpCode).json({ error: error.message, code: error.code });
  }
  else {
    console.log({ error: error.message, details: error.toString() });
    res.status(500).json({ error: 'Something went wrong :(' });
  }
});

module.exports = router;