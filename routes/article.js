const articles = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../middlewares/linkValidation');
const { getAllArticles, saveArticle, deleteArticle } = require('../controllers/article');

// Get all articles saved by the user
articles.get('/articles', getAllArticles);

// Save article to user's personal page
articles.post(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateUrl),
      image: Joi.string().required().custom(validateUrl),
    }).unknown(true),
  }),
  saveArticle,
);

articles.delete(
  '/articles/:articleId',
  celebrate({
    body: Joi.object().keys({
      user: Joi.object().keys({
        _id: Joi.string().hex().required(),
      }),
    }),
    params: Joi.object()
      .keys({
        articleId: Joi.string().hex().required(),
      }),
  }),
  deleteArticle,
);

module.exports = articles;
