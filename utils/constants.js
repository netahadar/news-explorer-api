const { NODE_ENV, SERVER_DB, JWT_SECRET } = process.env;

module.exports.DB = NODE_ENV === 'production'
  ? SERVER_DB
  : 'mongodb://localhost:27017/news-explorer';

module.exports.salt = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports.successCode = 200;

module.exports.createdCode = 201;

module.exports.forbiddenCode = 403;

module.exports.unauthorizedCode = 401;

module.exports.incorrectCredentials = 'Incorrect email or password';

module.exports.forbiddenText = 'Access to the requested resource is forbidden';

module.exports.badRequestMessage = 'Bad request';

module.exports.articleNotFound = 'Article not found';

module.exports.articleDeleted = 'article has been deleted successfully';

module.exports.userNotFound = 'User not found';

module.exports.userCreated = 'user created successfully';

module.exports.userExists = 'User is already exists';

module.exports.authRequired = 'Authorization required';

module.exports.serverError = 'An error occurred on the server';
