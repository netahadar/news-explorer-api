const { NODE_ENV, SERVER_DB, JWT_SECRET } = process.env;

module.exports.DB = NODE_ENV === 'production'
  ? SERVER_DB
  : 'mongodb://localhost:27017/news-explorer';

module.exports.salt = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
