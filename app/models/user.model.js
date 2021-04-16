const BaseModel = require('./base.model');

class UserModel extends BaseModel {

  constructor(storageDriver) {
    super(storageDriver);
    // Artificially add the Demo user to the storage (app memory for now)
    // Password is hashed as it would be in formal DB storage
    this.insert({ id: 1, username: 'demo-admin', roles: ['admin'], password: '$2b$05$BkIyZAakGK/agDe0opuHXeZ2KPnU2NlXzaBw9IlPfXDregawUAva.' });
    this.insert({ id: 1, username: 'demo-user', roles: ['user'], password: '$2b$05$BkIyZAakGK/agDe0opuHXeZ2KPnU2NlXzaBw9IlPfXDregawUAva.' });
    this.insert({ id: 1, username: 'demo-cs-rep', roles: ['cs-rep'], password: '$2b$05$BkIyZAakGK/agDe0opuHXeZ2KPnU2NlXzaBw9IlPfXDregawUAva.' });
  }

}

module.exports = UserModel;