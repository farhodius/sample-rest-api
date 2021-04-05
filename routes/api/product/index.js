const express = require('express');
const router = express.Router();
const productController = require('../../../app/controllers/product.controller');

router.post('/', async (req, res) => {
  const product = await productController.create(req.body);
  res.json(product);
});

router.get('/:id', async (req, res) => {
  const result = await productController.getById(req.params.id);
  res.json(result);
});

router.get('/', async (req, res) => {
  const results = await productController.search(req.query.name, req.query.page, req.query.perPage);
  res.json(results);
});

router.put('/:id', async (req, res) => {
  const result = await productController.update(req.body, req.params.id);
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const result = await productController.delete(req.params.id);
  res.json(result);
});

module.exports = router;