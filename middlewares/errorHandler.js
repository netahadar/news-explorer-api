const { serverError } = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .json({
      message: statusCode === 500
        ? serverError
        : message,
    });
};
