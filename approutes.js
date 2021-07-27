// Import Modules
const mongoose = require('mongoose');
const request = require('request');

const Schema = mongoose.Schema;

// Create Instance of Schema
let searchQuerySchema = new Schema({
  term: String,
  searched_on: Date
});

let searchQueryModel = mongoose.model('searchQueryModel',searchQuerySchema);

module.exports=function(app) {
  

// Connect to Database
mongoose.connect(process.env.DB,{useNewUrlParser:true, useUnifiedTopology:true},(err) => {
    if (err) {
      console.log(err);
    }
    
    console.log('Successfully connected to database');
  
    // Get JSON Response
    
    app.get('/imagesearch/:search',(req,res) => {
      let search = req.query.search;
      let page = req.query.offset? req.query.offset:1;
      let ggle = `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=017576662512468239146:omuauf_lfve&q=${search}&searchType=image`;
      searchQueryModel.findOne({term:search,searched_on:new Date().toUTCString()}, (err,doc) => {
        request(ggle,{json:true},(err,red,data) => {
          let dat=data.items.map((i) => {return{image_url:i.link,alt_text:i.snippet,page_url:i.image.contextLink}});
          dat=dat.slice(0,page);
          res.send(dat);
        });
      });
    });
  
    // Search for top 10
    app.get('/latest/imagesearch',(req,res) => {
    searchQueryModel.find({},null,{sort:{searched_on:-1},limit:10},(err,docs) => {
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
      
      // Create Instance of searchQueryModel
      let data = new searchQueryModel({
        term: search,
        searched_on: new Date()
      });
    });
  
});
    
}
