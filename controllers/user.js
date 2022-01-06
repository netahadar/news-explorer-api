const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const UserExistsError = require('../errors/userExistsError');
const UnauthorizedError = require('../errors/unauthorizedError');

// Get user data by Id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((chosenUser) => {
      if (!chosenUser) {
        throw new NotFoundError('No user with matching id found');
      }
      return res.status(200).send(chosenUser);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Bad request');
      }
      next(err);
    })
    .catch(next);
};

// Create a new user
module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 12)
    // eslint-disable-next-line no-shadow
    .then((password) => User.create({
      email,
      password,
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Bad request');
      }
      res.status(200).send({ message: 'user created successfully' });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new UserExistsError('User is already exists');
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
        throw new BadRequestError('Bad request');
      }
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200);
      res.json({ token });
    })
    .catch((err) => {
      if (err.cose === 401) {
        throw new UnauthorizedError('Incorrect email or password');
      }
      next(err);
    })
    .catch(next);
};
