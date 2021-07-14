// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
let mongo = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
let request = require('request');



// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Connect to DB
mongo.connect(process.env.DB,{useUnifiedTopology:true}, (err,client) => {
  let db = client.db('new');
  if (err) throw err;
});
// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.get('/imagesearch:/search', (req, res) => {
  
  let search = req.params.search;
  let page = req.query.offset? req.query.offset :1;
  db.collection('img').insertOne({term:search,searched_on:new Date().toUTCString()}, (err,doc) => {
    request(bing+search+'')
  });
  
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
