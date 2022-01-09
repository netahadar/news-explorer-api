const { serverError } = require('../utils/constants');

module.exports.errorHandler = (err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverError
        : message,
    });
};
