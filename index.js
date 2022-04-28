const express = require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const data= require(__dirname+"/dataService.js");

const userInfo=[];

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.post("/signupTeacher", function(req,res){
   userInfo[0]="destytojai";
   res.render("registration",{User:"",Error:false,Msg:null});
});
app.post("/signupStudent", function(req,res){
    userInfo[0]="studentai";
    res.render("registration",{User:"",Error:false,Msg:null});
 });
app.get("/signup", function(req,res){
    res.render("usersAcount");
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
        password: req.body.password,
        password2: req.body.password2
    };
    if(req.body.password==="" && req.body.password2==="" )msg="first";
    else if(req.body.password!==""){
        if(req.body.password2==="")msg="second";
        else if(req.body.password!==req.body.password2)msg="both";

    }else if(req.body.password2!==""){
        msg="first";}
    if(user.name!=="" && user.lastname!==""&&user.email!==""&&msg===null ){
        if(data.putUser(userInfo[0],user.email,user.name,user.lastname,user.password)) res.render("usersAcount");
    }
    else{res.render("registration",{User:user,Error:true,Msg:msg});}
});
app.post("/login", function(req,res){
    console.log(req.body.pasword);
});
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});