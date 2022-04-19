const express = require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");

const homePageInfo= "Hello to see you";
const aboutPage= "It's good to see you";
const aboutContact= "see you on my website";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("template");
});
app.get("/signup", function(req,res){
    res.render("registration");
});
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});