//jshint esversion:6

//jshint esversion:6

// Step 1 : npm install express body-parser ejs lodash mongoose
// Step 2 : npm init
// Step 3 : Creating method to use the library , and set listen port.
// Step 4 : node or nodemon app.js (To start the project)
//Step 5 : npm i mongoose-encryption , for simple encrypt password.
// step 6 : npm i dotenv , and create .env and .gitignore

//method to use the library
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")


//start to use express
const app = express();



//method to use ejs , auto point to view folder
app.set('view engine', 'ejs');

//method to use body parser
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

//create static path for css or img folder to route to folder
app.use(express.static("public"));


//Home Page
app.route("/")

  .get(function(req, res) {
    res.render("home");
  });

//Login Page
app.route("/login")

  .get(function(req, res) {
    res.render("login")
  })

  .post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err, foundUser){
      if (err){
        console.log(err);
      } else {
        if (foundUser){
          if (foundUser.password === password){
            res.render("secrets")
          } else {
            res.send("Username or Password invalid. Please try again !")
          }
        }
      }
    });
  });

//Register Page
app.route("/register")

  .get(function(req, res) {
    res.render("register")
  })

  .post(function(req,res){
    const newUser = new User({
      email: req.body.username,
      password:req.body.password
    });
    newUser.save(function(err){
      if (err){
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });










//Startup template, listening to the port, and start using nodejs
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
