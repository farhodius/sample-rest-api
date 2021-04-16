const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppMemoryDriver = require('../utils/app-memory.driver');
const storageDriver = new AppMemoryDriver();
const UserModel = require('../models/user.model');
const AppError = require('../errors/app.error');
const userModel = new UserModel(storageDriver);

class AuthController {

  async authenticate(username, password) {
    const user = await userModel.find({ username });
    if (!user) {
      throw new AppError('Invalid username and/or password.', 400, 'A-1000');
    }
    // Validate password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      throw new AppError('Invalid username and/or password.', 400, 'A-1000');
    }
    const token = jwt.sign({ id: user.id, username: user.username, roles: user.roles }, process.env.JWT_SECRET);

    return { token };
  }

}

module.exports = new AuthController();