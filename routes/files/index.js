const express = require('express');
const router = express.Router();
const fileController = require('../../app/controllers/file.controller');

router.post('/upload', async (req, res) => {
  const result = await fileController.store(req);
  res.json(result);
});

router.get('/list', async (req, res) => {
  const files = await fileController.findAll();
  res.json(files);
});

router.get('/download', async (req, res) => {
  const filePath = await fileController.getFilePath(req.query.filename);
  res.download(filePath);
});

module.exports = router;