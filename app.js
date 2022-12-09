const express = require("express");
const cors = require("cors");
const app = express();
const {
  categoryObjects,
  reviewObject,
  collectUsers,
  patchUpdateReviews,
  getAllReviews,
  collectComments,
  postComment,
  deleteComment,
  getEndpoints,
} = require("./controllers/controllers");

app.use(cors());
app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('ok');
});

app.use((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
});

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/categories", categoryObjects);
app.get("/api/reviews/:review_id", reviewObject);
app.get("/api/users", collectUsers);
app.patch("/api/reviews/:review_id", patchUpdateReviews);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", collectComments);
app.post("/api/reviews/:review_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

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
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "error: User not found" });
  } else if (err.code === "42703") {
    response.status(400).send({ msg: "Invalid sort query, try again." });
  } else if (err.code === "42601") {
    response.status(400).send({ msg: "Invalid order query, try again" });
  }
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send("Server Error!");
});

module.exports = app;
