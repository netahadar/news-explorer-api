const { isCelebrateError } = require('celebrate');
const { serverError } = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
module.exports.errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;
  if (isCelebrateError(err)) {
    statusCode = 400;
    message = 'Validation faild';
  }
  res.status(statusCode).json({
    message: statusCode === 500 ? serverError : message,
  });
};
