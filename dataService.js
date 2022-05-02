const express = require("express");
const bodyParser= require("body-parser");
const mysql = require('mysql');
const AES = require('mysql-aes-binary');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'viktorina'
});
const key="lokyslokiukas";

module.exports.putUser = function(where,email,name,surname,password) {
    var sql = "INSERT INTO "+ where+ "(Elektroninis_pastas, Vardas,Pavarde,Slaptazodis) VALUES ('"+email+"', '"+name+"', '"+surname+"','"+AES.encrypt(password, key) +"')";
      con.query(sql, function (err, result) {
      if (err) {throw err}
      console.log("1 record inserted");
    });
    return true;
};