const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// Init app
var db;
var Todos;
const app = express();
const port = 3000;
/// middleware

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/// Connect to the db ,
MongoClient.connect(url, (err, client) => {
  if (err) {
    throw err;
  } else {
    console.log("MongoDB connected...");
  }
  db = client.db("todoapp");
  Todos = db.collection("todos");
  app.listen(port, () => {
    console.log("Server running on port " + port);
  });
});
const ObjectId = require("mongodb").ObjectID;
app.get("/", (req, res, next) => {
  Todos.find().toArray((err, todos) => {
    if (err) return console.log(err);
    console.table(todos);
    console.log(todos.length);

    res.render("index", {
      todos: todos
    });
  });
});
app.post("/todo/add", (req, res, next) => {
  /// Create a todo object
  const todo = {
    text: req.body.text,
    body: req.body.body
  };
  Todos.insert(todo, (err, result) => {
    if (err) return console.log(err);
    console.log("Todo Added");
    res.redirect("/");
  });
});
app.delete("/todo/delete/:id", (req, res, next) => {
  const query = {
    _id: ObjectId(req.params.id)
  };
  Todos.deleteOne(query, (err, response) => {
    if (err) return console.log(err);
    console.log("Todo removed from database");
  });
  res.sendStatus(200);
});

app.get("/todo/edit/:id", (req, res, next) => {
  const query = {
    _id: ObjectId(req.params.id)
  };
  Todos.find(query).next((err, todo) => {
    if (err) return console.log(err);
    res.render("edit", {
      todo: todo
    });
  });
});
app.post("/todo/edit/:id", (req, res, next) => {
  /// Create a todo object
  const query = {
    _id: ObjectId(req.params.id)
  };
  const todo = {
    text: req.body.text,
    body: req.body.body
  };
  Todos.updateOne(query, { $set: todo }, (err, result) => {
    if (err) return console.log(err);
    console.log("Todo updated ...");
    res.redirect("/");
  });
});
