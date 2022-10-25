require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;