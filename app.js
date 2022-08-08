//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');//first install on hyper by npm i mongoose-encryption


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true}); //creating database


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


//here we are accesing data from the .env file.
userSchema.plugin(encrypt,{ secret: process.env.SECRET, encryptedFields: ["password"] });//this plugin should be added before the mongoose model.
//this will encrypt the password.

//when we will save it mongoose encrypt will encrypt it and decode it when we will find it.


const User = new mongoose.model("User",userSchema);



app.get("/",function(req,res)
{
  res.render("home");
});

app.get("/login",function(req,res)
{
  res.render("login");
});

app.get("/register",function(req,res)
{
  res.render("register");
});


app.post("/register",function(req,res){
const newUser = new User({
  email: req.body.username,
  password: req.body.password
});

newUser.save(function(err){
  if(err)
  {
    console.log(err);
  }
  else {
    res.render("secrets");
  }
});

});


app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

User.findOne({email: username},function(err,foundUser){
  if(err)
  {
    console.log(err);
  }
  else {
    if(foundUser.password === password)
    {

      res.render("secrets");
    }
  }
})



})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
