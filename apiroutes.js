const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Instance of Schema
let searchQuerySchema = new Schema({
  query: String
});

let searchQueryModel = mongoose.model('searchQueryModel',searchQuerySchema);

module.exports = function(app) {
  // Connect to Database
  mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology:});
};
