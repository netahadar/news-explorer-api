const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
const { salt, authRequired } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(authRequired);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, salt);
  } catch (err) {
    throw new UnauthorizedError(authRequired);
  }
  req.user = payload;
  next();
};
