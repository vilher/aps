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
module.exports.putQuiz= function(where,name,comment,user){
  if(where==="studentai"){
  var sql = "INSERT INTO mokymosi_viktorina (Pavadinimas,Komentaras,Data,studentai_Elektroninis_pastas) VALUES ('"+name+"', '"+comment+"', '"+(String(new Date().getFullYear())+"-"+String(new Date().getMonth()+1)+"-"+String(new Date().getDate()))+"','"+user+"')";
      con.query(sql, function (err, result) {
      if (err) {throw err}
   
    });}
    else{var sql = "INSERT INTO viktorina (Pavadinimas,Aprasymas,Data,destytojai_Elektroninis_pastas) VALUES ('"+name+"', '"+comment+"', '"+(String(new Date().getFullYear())+"-"+String(new Date().getMonth()+1)+"-"+String(new Date().getDate()))+"','"+user+"')";
    con.query(sql, function (err, result) {
    if (err) {throw err}

  });}
  return true;
}
module.exports.putQuestion= function(where,question,ID){
  if(where==="studentai"){
  var sql = "INSERT INTO mokymosi_klausimai (Klausimas,mokymosi_viktorina_ID) VALUES ('"+question+"','"+ID+"')";
      con.query(sql, function (err, result) {
        sql="SELECT MAX(id) FROM mokymosi_klausimai"
        con.query(sql, function (err, result) {
          return result[0];
        })
    });}
    else{var sql = "INSERT INTO klausimas (Klausimas,viktorina_ID) VALUES ('"+question+"','"+ID+"')";
    con.query(sql, function (err, result) {
    if (err) {
      throw err}

  });}
  return true;
}
