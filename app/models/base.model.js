const Joi = require('joi');
const AppError = require('../errors/app.error');
const StorageDriver = require('../utils/app-memory.driver');

class BaseModel {

  constructor(storageDriver) {
    this.storageDriver = storageDriver;
  }

  insert(item) {
    return this.storageDriver.add(item);
  }

  update(item, filters) {
    return this.storageDriver.update(item, filters);
  }

  delete(filters) {
    return this.storageDriver.delete(filters);
  }

  find(filters) {
    return this.storageDriver.find(filters);
  }

  search(filters, offset, limit) {
    return this.storageDriver.search(filters, offset, limit);
  }

  validate(model) {
    const res = this.schema.validate(model, { abortEarly: false });
    if (res.error) {
      const details = res.error.details.map((d) => d.message);
      throw new AppError(details.join('|'), 400, 'P-1010');
    }
    return res.value;
  }

}

module.exports = BaseModel;