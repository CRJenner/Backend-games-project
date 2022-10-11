const express = require("express");
const { categoryObjects, reviewObject } = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", categoryObjects);
app.get("/api/reviews/:review_id", reviewObject);

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, response, next) => {
  reponse.status(500).send("Server Error!");
});

module.exports = app;
