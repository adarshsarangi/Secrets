//jshint esversion:6

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt = require("mongoose-encryption");
const md5 = require('md5');

const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/UserDB");

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});




//userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

//plugin before your create model using userSchema

const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const pass = md5(req.body.password);
  User.findOne({email:username},function(err,foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === pass){
          res.render("secrets");
        }
      }else{
        res.send("User not found ");
      }
    }else{
      console.log(err);
    }
  })


});

app.listen(3000,function(){
  console.log("Server started on port 3000");
})
