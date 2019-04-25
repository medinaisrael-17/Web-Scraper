var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

var app = express();


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/webScraper", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
    axios.get("https://old.reddit.com/r/news/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("p.title").each(function (i, element) {

            var result = {};

            result.title = $(this).text();

            result.link = $(this).children().attr("href");

            if (link[0] === "/") {
                link = URL + link;
            }

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });
        
        res.send("Scrape Complete");
    });
});