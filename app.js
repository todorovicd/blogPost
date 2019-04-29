const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      methodOverride = require("method-override"),
      expressSanitizer = require("express-sanitizer");

//App Config
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser:true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose/Model Config
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
let Blog = mongoose.model("Blog", blogSchema);
mongoose.set('useFindAndModify', false);

//Restful Routes
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log("Error!");
        }
        else {
            res.render("index", {blogs, blogs});
        }
    });
});

//NEW Route
app.get("/blogs/new", (req, res) => {
    res.render("new");
})

//CREATE Route
app.post("/blogs", (req, res) => {
    //create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            res.render("new");
        }
        else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW Route
app.get("/blogs/:id", (req, res) => {
    //Sanitizing user input
    //req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", { blog: foundBlog });
        }
    });
});

//EDIT Route
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//UPDATE Route
app.put("/blogs/:id", (req, res) => { 
    //Sanitizing user input
    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE Route
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    })
});

//Initilize the server
app.listen(3000, () => {
    console.log("SERVER IS RUNNING!")
});