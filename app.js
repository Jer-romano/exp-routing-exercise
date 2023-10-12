const express = require("express");
const db = require("./fakeDb");
const itemRoutes = require('./itemRoutes')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parse form data
app.use("/items", itemRoutes);


/** general error handler */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
  
    return res.json({
      error: err.message,
    });
  });
  
  module.exports = app;