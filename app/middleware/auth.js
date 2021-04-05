const jwt = require('jsonwebtoken');
const AppError = require('../errors/app.error');

module.exports = (req, res, next) => {
  const rawToken = req.header('Authorization');
  if (!rawToken) {
    throw new AppError('Unauthorized. Auth header is missing.', 400, 'A-1010');
  }

  const token = rawToken.replace(/^Bearer\s*/, '');
  if (!token) {
    throw new AppError('Unauthorized. Auth token is missing.', 400, 'A-1020');
  }
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Unauthorized. Invalid token.', 400, 'A-1030');
  }

  if (!user) {
    throw new AppError('Unauthorized. Invalid token.', 400, 'A-1030');
  }
  req.user = user;
  next();

}