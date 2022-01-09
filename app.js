const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB } = require('./utils/constants');
const index = require('./routes/index');
const { limiter } = require('./middlewares/rateLimiter');
require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

app.use(requestLogger);

// Celebrate error handler
app.use(errors());

app.use('/', index);

app.use(errorLogger);

// Centralized error handler
app.use(errorHandler);

app.listen(PORT);
