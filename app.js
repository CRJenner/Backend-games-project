const express = require("express");
const { categoryObjects, reviewObject } = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", categoryObjects);

app.get("/api/reviews/:review_id", reviewObject);

app.use((err, request, response, next) => {
  console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(error);
  }
});
// response.status(404).send({ msg: "Not a valid path" });

// app.use((err, request, response, next) => {
//   response.status(500).send({ msg: "500 Internal Error" });
// });

module.exports = app;
