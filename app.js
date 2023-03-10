const express = require("express");
const cors = require("cors");
const app = express();
const { collectComments,postComment, deleteComment} = require("./controllers/commentController");
const {categoryObjects} = require("./controllers/categoriesController")
const {getReviewById, patchUpdateReviews, getAllReviews} = require("./controllers/reviewController")
const {collectUsers} = require("./controllers/usersController")
const {getEndpoints} = require("./controllers/endPointController")

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/categories", categoryObjects);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users", collectUsers);
app.patch("/api/reviews/:review_id", patchUpdateReviews);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", collectComments);
app.post("/api/reviews/:review_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", (request, response, next) => {
  response.status(404).send({ msg: "Invalid pathway"})
})

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid review id" });
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "This is not a user" });
  } else if (err.code === "23502") {
    response.status(404).send({ msg: "Review Id not found" });}
  // } else if (err.code === "42703") {
  //   response.status(400).send({ msg: "Invalid sort query, try again." });
  // } else if (err.code === "42601") {
  //   response.status(400).send({ msg: "Invalid order query, try again" });
  // }
  next(err);
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  response.status(500).send("Server Error!");
});

module.exports = app;
