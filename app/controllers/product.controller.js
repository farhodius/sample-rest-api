const ProductModel = require('../models/product.model');
const AppMemoryDriver = require('../utils/app-memory.driver');
const storageDriver = new AppMemoryDriver();
const productModel = new ProductModel(storageDriver);
const AppError = require('../errors/app.error');

class ProductController {

  async create(item) {
    // Validate schema
    item = productModel.validate(item);

    // Check if unique
    const exists = await productModel.find({ name: item.name });
    if (exists) {
      throw new AppError('Product with this name already exists.', 400, 'P-1000');
    }
    return productModel.insert(item);
  }

  async update(item, id) {
    // Check if exists
    const filters = { _id: parseInt(id) };
    const exists = await productModel.find(filters);
    if (!exists) {
      throw new AppError('Product does not exist.', 404, 'P-1030');
    }
    // Validate schema
    item = productModel.validate(item);
    
    const result = await  productModel.update(item, filters);
    if(!result) {
      throw new AppError('Something went wrong. Unable to udpate product.', 500, 'P-1040');
    }
    item._id = id;
    return Promise.resolve(item);
  }

  async delete(id) {
    // Check if exists
    const filters = { _id: parseInt(id) };
    const exists = await productModel.find(filters);
    if (!exists) {
      throw new AppError('Product does not exist.', 404, 'P-1050');
    }
    
    const result = await productModel.delete(filters);
    if (!result) {
      throw new AppError('Something went wrong. Unable to delete product.', 500, 'P-1040');
    }
    
    return Promise.resolve({result: 'Success', deletedId: id});
  }


  async search(name, page, perPage) {
    page = parseInt(page) < 1 ? 1 : parseInt(page);
    perPage = parseInt(perPage) < 1 ? process.env.DEFAULT_RESPONSE_LIMIT : parseInt(perPage);
    const offset = perPage * (page - 1);
    if (name) {
      return productModel.search({ name }, offset, perPage);
    }
    else {
      return productModel.search({}, offset, perPage);
    }
  }

  async getById(id) {
    const product = await productModel.find({ _id: parseInt(id) });
    if (!product) {
      throw new AppError('Product not found.', 404, 'P-1020');
    }
    return Promise.resolve(product);
  }

}

module.exports = new ProductController();