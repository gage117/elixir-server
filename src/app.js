require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const axios = require('axios');

const app = express();

const API = axios.create({baseURL: 'https://api-v3.igdb.com/'})
API.defaults.headers.post['user-key'] = 'bb2aedca0775a449624cae062ea21d0f'

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/games', async (req, res) => {
  const queryString = 'fields name;limit 50;'
  const response = await API.post('/games', queryString)
  res.send(response.data);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  } else {
    // eslint-disable-next-line no-console
    console.log(error);
    response = {message: error.message, error};
  }
  res.status(500).json(response);
});

module.exports = app;