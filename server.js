// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');

const Schema = mongoose.Schema;

// Create Instance of Schema
let searchQuerySchema = new Schema({
  term: String,
  searched_on: Date
});

let searchQueryModel = mongoose.model('searchQueryModel',searchQuerySchema);
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

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
      let ggle = `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=017576662512468239146:omuauf_lfve&q=${search}&searchType=image&imgType=photo`;
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
    });
  
});
    



// 404 Not Found Middleware
app.use(function(req,res,next) {
  res.status(404).type('text').send('Not Found');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


