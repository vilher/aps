const express = require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const { use } = require("express/lib/application");

const homePageInfo= "Hello to see you";
const aboutPage= "It's good to see you";
const aboutContact= "see you on my website";
const userInfo=[];

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("template");
});
app.get("/signup", function(req,res){
    res.render("registration",{User:"",Error:false,Msg:null});
});
app.get("/login", function(req,res){
    res.render("login");
});
app.post("/signup", function(req,res){
    
    var msg=null;
    var user={
        name:req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };
    if(req.body.password!==req.body.password2){
        msg="Slaptažodžiai nėra vienodi"
    }
    else if(req.body.password!==""){msg="Įveskite slaptažodį";}
    if(req.body.password2!=="")msg="Pakartokite slaptažodį";
    
    res.render("registration",{User:user,Error:true,Msg:msg});
});
app.post("/login", function(req,res){
    console.log(req.body.pasword);
});
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});