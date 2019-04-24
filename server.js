var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


var app = express();

app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/onionScraper", {
  useNewUrlParser: true
});

var PORT = 8080;

//Routes 

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");


// app.get("/", function(req,res){

//     db.Article.deleteMany({})
//     .then(function(results){
//       res.json(results);
//     })
//     .catch(function(err){
//         res.json(err);
//     })
// });


app.get("/scrape", function (req, res) {
  db.Article.deleteMany({})
    .then(function (results) {
      axios.get("https://www.theonion.com/").then(function (response) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);

        //Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("h1").each(function (i, element) {

          var result = {};
          result.title = $(this)
            .children("a")
            .text();
          result.link = $(this)
            .children("a")
            .attr("href");
          // articlesArr.push(result);
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function (dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function (err) {
              // If an error occurred, log it
              console.log(err);
            });
        });
        // Log the results once you've looped through each of the elements found with cheerio
        res.send("scrape initiated");

      });
    })
    .catch(function (err) {
      res.json(err);
    })


})

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (articles) {
      res.json(articles);
    })
    .catch(function (err) {
      res.json(err);
    })
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({
      _id: req.params.id
    })
    .populate("note")
    .then(function (article) {
      res,
      json(article);
    })
    .catch(function (err) {
      res.json(err);
    })
})

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (note) {
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $set: {
          note: note._id
        }
      }, {
        new: true
      });
    })
    .then(function (article) {
      res.json(article);
    })
    .catch(function (err) {
      res.json(err);
    })
})


/////// 
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});