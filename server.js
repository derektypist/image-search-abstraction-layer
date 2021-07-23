// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

const Schema = mongoose.Schema;

// Create Instance of Schema
let searchQuerySchema = new Schema({
  images: String
});

let searchQueryModel = mongoose.model('searchQueryModel',searchQuerySchema);
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Connect to Database
mongoose.connect(process.env.DB, {useNewUrlParser:true, useUnifiedTopology:true}, (err) => {
    if (err) {
      console.log(err);
    }
    
    console.log('Successfully connected to database');
});
    
// Get JSON Response
    
app.get('/api',(req,res) => {
      let search = req.query.search;
      let page = req.query.offset? req.query.offset:1;
      let ggle = `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=017576662512468239146:omuauf_lfve&q=${search}&searchType=image&imgType=photo`;
      axios.get(ggle).then(data => {
        res.json(data.data.items);
      }).catch(err => {
        res.send("Error in fetching the images");
      });
    });
    
// Search for top 10
app.get('/data',(req,res) => {
            searchQueryModel.find({},null,{sort:{_id:-1},limit:10},(err,docs) => {
              if (err) {
                console.log(err);
              }
              
              res.json(docs);
            });
          });
    
    // POST Method
    app.post('/data', (req,res) => {
      let doc = new searchQueryModel({images:req.body.searchQuery});
      doc.save((err) => {
        if (err) {
          console.log(err);
        }
        console.log("Saved successfully");
        res.send("Posted successfully");
      });
      
    });
  



// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});



// 404 Not Found Middleware
app.use(function(req,res,next) {
  res.status(404).type('text').send('Not Found');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


