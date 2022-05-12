const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dat = require(__dirname + "/dataService.js");
const http = require('http');
require('dotenv').config();

const userInfo = [];
const question = [];
let answer = [];

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
        http.get(url + userInfo[0] + "/" + user.email, function (responce) {
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
    }
    else { res.render("registration", { User: user, Error: true, Msg: msg }); }
});
app.get("/login", function (req, res) {
    res.render("login", { Email: "null", Password: "null" });
});
app.post("/login", function (req, res) {
    const url = "http://localhost:5000/";

    http.get(url + "destytojai" + "/" + req.body.email, function (responce) {
        responce.on("data", function (data) {
            if (JSON.parse(data)[0].Elektroninis_pastas === "false") {

                http.get(url + "studentai" + "/" + req.body.email, function (responce) {
                    responce.on("data", function (data) {
                        if (JSON.parse(data)[0].Elektroninis_pastas === "false") {
                            res.render("login", { Email: req.body.email, Password: "null" });
                        }
                        else {
                            http.get(url + "studentai/findUser/" + req.body.email + "/" + req.body.password, function (responce) {
                                responce.on("data", function (data) {
                                    if (JSON.parse(data)[0].Elektroninis_pastas === "false") { res.render("login", { Email: "null", Password: req.body.email }); }
                                    else {
                                        userInfo[0] = "studentai";
                                        userInfo[1] = JSON.parse(data)[0];
                                        res.render("body")
                                    }
                                })
                            })
                        }

                    })
                })
            }
            else {
                http.get(url + "destytojai/findUser/" + req.body.email + "/" + req.body.password, function (responce) {
                    responce.on("data", function (data) {
                        if (JSON.parse(data)[0].Elektroninis_pastas === "false") { res.render("login", { Email: "null", Password: req.body.email }); }
                        else {
                            userInfo[0] = "destytojai";
                            userInfo[1] = JSON.parse(data)[0];
                            res.render("body");
                        }
                    })
                })
            }
        })
    })

});
app.get("/sign_out", function (req, res) {
    userInfo.length = 0;
    question.length = 0;
    answer.length = 0;

    res.render("usersAcount");
});
app.get("/about", function (req, res) {
    res.render("body");
});
app.post("/create", function (req, res) {
    const ques = {
        name: req.body.name,
        img: req.body.img,
        comment: req.body.comment
    }
    question[0] = ques;
    const quest = {
        question: ""
    }
    question[1] = quest;
    res.render("createQuestions", { Question: question, Answer: answer });
})
app.get("/createQuestions", function (req, res) {

    saving();
    console.log( answer[0]+" " + answer.length + " ");
    question[question.length] = "";
    res.redirect("/addQuestions");
})
app.get("/addQuestions", function (req, res) {
    answer.length = 0;
    res.render("createQuestions", { Question: question, Answer: answer });
})
app.post("/backtoBody", function (req, res) {
    question.length = 0;
    answer.length = 0;

    res.render("body");
})
app.post("/addAnswer", function (req, res) {
    answer.push(req.body.answer);
    ques = {
        question: req.body.question
    }
    question[question.length - 1] = ques;
    console.log(question);
    res.redirect("/addQuestions");
})
app.post("/deleteAnswer", function (req, res) {
    var index = answer.indexOf(req.body.delete);
    answer.splice(index, 1);

    res.redirect("/createQuestions");
})
app.get("/deleteQuiz", function (req, res) {
    console.log(req.body.delete);

    res.redirect("/see");
})
app.get("/create", function (req, res) {
    res.render("create");
})
app.get("/share", function (req, res) {
    res.render("body");
})
app.get("/see", function (req, res) {
    const url = "http://localhost:5000/viktorina/"
    http.get(url + "s039891@ad.viko.lt", function (responce) {
        responce.on("data", function (data) {
            if (JSON.parse(data)[0].Pavadinimas === 'false') res.redirect("/create")
            else {
                res.render("seeAll", { Quiz: JSON.parse(data) });
            }
        })
    })
})
app.post("/saveAnswer", function (req, res) {
    userInfo[0] = 'studentai';
    userInfo[1] = {
        Elektroninis_pastas: 'viktevilimaite@gmail.com'
    }
    dat.putQuiz(userInfo[0], question[0].name, question[0].comment, userInfo[1].Elektroninis_pastas)
    res.redirect("/createQuestions");
   
})
function saving() {
    const url = "http://localhost:5000/"
    http.get(url + "ID/" + userInfo[0] + "/" + userInfo[1].Elektroninis_pastas + "/" + question[0].name + "/" + question[0].comment, function (responce) {
        responce.on("data", function (data) {
            const QuestID = JSON.parse(data).ID;

            dat.putQuestion(userInfo[0], question[question.length - 2].question, QuestID)
            http.get(url + "questionID/mokymosi_klausimai", function (responce) {
                responce.on("data", function (data) {

                    //JSON.parse(data).value+"  "+question[question.length - 2].question 
                        console.log( answer[0]+" " + answer.length + " ");
                    
                })
            })
        })
    })
}
function reseat()
{
    answer.length = 0;
}
app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
