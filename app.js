const express = require("express");
const {
  categoryObjects,
  reviewObject,
  collectUsers,
  patchUpdateReviews,
  getAllReviews,
  collectComments,
} = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", categoryObjects);
app.get("/api/reviews/:review_id", reviewObject);
app.get("/api/users", collectUsers);
app.patch("/api/reviews/:review_id", patchUpdateReviews);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", collectComments);

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid input, use a number" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  response.status(500).send("Server Error!");
});

module.exports = app;
