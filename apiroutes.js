const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Instance of Schema
let searchQuerySchema = new Schema({
  query: String
});

let searchQueryModel = mongoose.model('searchQueryModel',searchQuerySchema);


