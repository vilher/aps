const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dat = require(__dirname + "/dataService.js");
const http = require('http');

const userInfo = [];
const question =[];

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post("/signupTeacher", function (req, res) {
    userInfo[0] = "destytojai";
    res.render("registration", { User: "", Error: false, Msg: null });
});
app.post("/signupStudent", function (req, res) {
    userInfo[0] = "studentai";
    res.render("registration", { User: "", Error: false, Msg: null });
});
app.get("/signup", function (req, res) {
    res.render("usersAcount");
});
app.get("/", function (req, res) {
    res.render("usersAcount");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.post("/signup", function (req, res) {
    var msg = null;
    var user = {
        name: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    };
    if (req.body.password === "" && req.body.password2 === "") msg = "first";
    else if (req.body.password !== "") {
        if (req.body.password2 === "") msg = "second";
        else if (req.body.password !== req.body.password2) msg = "both";

    } else if (req.body.password2 !== "") {
        msg = "first";
    }
    if (user.name !== "" && user.lastname !== "" && user.email !== "" && msg === null) {
            const url = "http://localhost:5000/";
            http.get(url+userInfo[0]+"/"+user.email, function (responce) {
                responce.on("data", function (data) {
                    if (JSON.parse(data)[0].Elektroninis_pastas === "false") { 
                        if (dat.putUser(userInfo[0], user.email, user.name, user.lastname, user.password)) {
                            res.render("body");
                        }
                        else { res.render("registration", { User: user, Error: true, Msg: msg }); }
                     }
                    else { res.render("login"); }
                })
            })
            console.log(userInfo);
    }
    else { res.render("registration", { User: user, Error: true, Msg: msg }); }
});
app.post("/login", function (req, res) {
    console.log(req.body.pasword);
});
app.get("/sign_out", function (req, res) {
    res.render("usersAcount");
});
app.get("/about", function (req, res) {
    res.render("body");
});
app.post("/create", function (req, res) {
    const ques={
        name:req.body.name,
        question:req.body.question,
        img:req.body.img,
        comment:req.body.comment
    }
    question[0]=ques;
    res.redirect("/createQuestions");
})
app.get("/createQuestions", function (req, res) {
    console.log(question[0]);
    res.render("createQuestions",{Question: question[0]});
})
app.post("/backtoBody",function (req, res){
    res.render("body");
})
app.get("/create", function (req, res) {
    res.render("create");
})
app.get("/share", function (req, res) {
    res.render("share");
})
app.get("/see", function (req, res) {
    res.render("share");
})
app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
