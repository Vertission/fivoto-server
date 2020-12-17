const mongoist = require('mongoist');
const url = 'mongodb://localhost:27017/fivoto';

module.exports = mongoist(url);
