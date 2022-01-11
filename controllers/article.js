const Article = require('../models/article');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const {
  successCode,
  createdCode,
  forbiddenCode,
  badRequestMessage,
  articleNotFound,
  articleDeleted,
  forbiddenText,
} = require('../utils/constants');

// Get all articles
module.exports.getAllArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError(articleNotFound);
      }
      res.status(successCode).send(articles);
    })
    .catch(next);
};

// Save an article to user's personal page
module.exports.saveArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner = req.user._id,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((savedArticle) => {
      if (!savedArticle) {
        throw new BadRequestError(badRequestMessage);
      }
      res.status(createdCode).send(savedArticle);
    })
    .catch(next);
};

// Delete article
module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .select('+owner')
    .then((chosenArticle) => {
      if (!chosenArticle) {
        throw new NotFoundError(articleNotFound);
      }
      if (!chosenArticle.owner._id.equals(req.user._id)) {
        throw new Error(forbiddenText);
      }
      Article.deleteOne({ _id: articleId }).then(() => {
        res.status(successCode);
        res.json({ message: articleDeleted });
      });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(forbiddenCode).send({ message: `${err.message}` });
      }
      if (err.name === 'CastError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};
