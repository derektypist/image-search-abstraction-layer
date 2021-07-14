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

// send the default array of dreams to the webpage
app.get('/imagesearch:/search', (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(0);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
