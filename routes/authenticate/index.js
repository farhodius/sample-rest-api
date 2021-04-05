const express = require('express');
const router = express.Router();
const authController = require('../../app/controllers/auth.controller');

router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  const token = await authController.authenticate(username, password);
  res.json(token);
});

module.exports = router;