const Article = require('../models/article');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

// Get all articles
module.exports.getAllArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError('No articles to display');
      }
      res.status(200).send(articles);
    })
    .catch(next);
};

// Save an article to user's personal page
module.exports.saveArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image, owner = req.user._id,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((savedArticle) => {
      if (!savedArticle) {
        throw new BadRequestError('Bad request');
      }
      res.status(200).send(savedArticle);
    })
    .catch(next);
};

// Delete article
module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId).select('+owner')
    .then((chosenArticle) => {
      if (!chosenArticle) {
        throw new NotFoundError('No article with matching id found');
      }
      if (!chosenArticle.owner._id.equals(req.user._id)) {
        throw new Error('Access to the requested resource is forbidden');
      }
      Article.deleteOne({ _id: articleId })
        .then(() => {
          res.status(200);
          res.json({ message: 'article has been deleted successfully' });
        });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(403).send({ message: `${err.message}` });
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Bad request');
      }
      next(err);
    })
    .catch(next);
};
