const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://monitoring_user:G6QiBEoDMPSytWWK@prototipo-lzjj3.mongodb.net/prototipo';

module.exports = MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });