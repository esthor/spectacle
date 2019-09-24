/**
 * Extend config for _just_ the lib export.
 */
const config = require('./webpack.config');

config.entry = {
  lib: './src/index.js'
};

module.exports = config;
