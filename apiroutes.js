const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Instance of Schema
let searchQuerySchema = new Schema({
  query: String
});

let searchQueryModel = mongoose.model('searchQueryModel',searchQuerySchema);

module.exports = function(app) {
  // Connect to Database
  mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology:true}, (err) => {
    if (err) {
      console.log(err);
    }
    
    console.log('Successfully connected to database');
    
    
    // Get JSON Response
    
    app.get('/imagesearch/:search',(req,res) => {
      let search = req.params.search;
      let page = req.query.offset? req.query.offset:1;
      let ggle = `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=017576662512468239146:omuauf_lfve&q=`;
      searchQueryModel.insertOne();
    });
    
    // Search for top 10
    app.get('/latest/imagesearch',(req,res) => {
            searchQueryModel.find({},null,{sort:{_id:-1},limit:10},(err,docs) => {
              if (err) {
                console.log(err);
              }
              
              res.json(docs);
            });
          });
    
    // POST Method
    app.post('/api/imagesearch', (req,res) => {
      let search = req.body.search;
      search = encodeURI(search);
      let page = req.body.page ? req.body.page:1;
    });
  });
};
