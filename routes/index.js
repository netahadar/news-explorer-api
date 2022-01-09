const index = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const user = require('./user');
const articles = require('./article');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/user');
const NotFoundError = require('../errors/notFoundError');

index.use('/', auth, user);
index.use('/', auth, articles);
index.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
index.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
index.get('*', () => {
  throw new NotFoundError('OOPS! page not found');
});

module.exports = index;
