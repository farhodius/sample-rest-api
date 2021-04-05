const BaseModel = require('./base.model');
const Joi = require('joi');

class ProductModel extends BaseModel {
  schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(5).max(1000).required(),
    price: Joi.number().precision(2).min(1).max(20000).required()
  });
}

module.exports = ProductModel;