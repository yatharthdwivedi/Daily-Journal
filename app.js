//jshint esversion:6
const dotenv = require('dotenv')
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require('mongoose');

dotenv.config()

mongoose.connect(process.env.MONGO, {useUnifiedTopology: true, useNewUrlParser: true})

const homeStartingContent = "This is Daily Journals Project. You can write about your daily journals";
const aboutContent = "This is Daily Journals Project made by Express, EJS and MONGO DB";
const contactContent = "You can contact me on this email =>";

const app = express();

// let posts = [];

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const contactSchema = new mongoose.Schema({
  email: String,
  mess: String
});

const Post  = mongoose.model("Post", postSchema);

const Contact = mongoose.model("Contact", contactSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req,res) {
  
  // res.send("Yo");
 
  Post.find({}, function(err, found) {
    if(err) {
      console.log(err);
    }
    else {
      res.render("home",{
        tag:homeStartingContent,
        posts: found,
      })
    }
  })

})

app.get("/about", function(req,res) {
  res.render("about",{content: aboutContent});
})

app.get("/contact", function(req,res) {
  
    res.render("contact", {con: contactContent})
  
})

app.post("/contact", function(req,res) {

  const contact = new Contact({
    email : req.body.email,
    mess : req.body.message
  })

  contact.save().then(()=> {
    res.redirect("/")
  })

})

app.get("/compose", function(req, res) {
  res.render("compose")
})

app.post("/compose", function(req, res) {
 
  const post = new Post({
     title : req.body.postTitle ,
     content : req.body.postBody, 
  })

  
  post.save().then(() => {
    res.redirect("/");
  });

})

app.get("/posts/:postId", function(req, res) {
  let reqId = req.params.postId;
  Post.findById(reqId, function(err, post) {
   if(err) {
     console.log(err);
   }
   else {
     res.render("post", {
       title: post.title,
       content: post.content
     })
   }

  })
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
