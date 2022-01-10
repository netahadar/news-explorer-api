const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const UserExistsError = require('../errors/userExistsError');
const UnauthorizedError = require('../errors/unauthorizedError');
const {
  userNotFound,
  successCode,
  badRequestMessage,
  userCreated,
  userExists,
  createdCode,
  salt,
  unauthorizedCode,
  incorrectCredentials,
} = require('../utils/constants');

// Get user data by Id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((chosenUser) => {
      if (!chosenUser) {
        throw new NotFoundError(userNotFound);
      }
      return res.status(successCode).send(chosenUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};

// Create a new user
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 12)
    // eslint-disable-next-line no-shadow
    .then((password) => User.create({
      email,
      password,
      name,
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError(badRequestMessage);
      }
      res.status(createdCode).send({ message: userCreated });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new UserExistsError(userExists);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new BadRequestError(badRequestMessage);
      }
      const token = jwt.sign({ _id: user._id }, salt, { expiresIn: '7d' });
      res.status(successCode);
      res.json({ token });
    })
    .catch((err) => {
      if (err.code === unauthorizedCode) {
        throw new UnauthorizedError(incorrectCredentials);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};
