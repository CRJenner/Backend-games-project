const {
  fetchAllComments,
  postedComment,
  removeComment,
} = require("../models/models");




exports.collectComments = (request, response, next) => {
  const { review_id } = request.params;
  fetchAllComments(review_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  const { username } = request.body;
  const { body } = request.body;
  const { review_id } = request.params;
  postedComment(username, body, review_id)
    .then((comments) => {
      response.status(201).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then((rows) => {
      if (rows.length === 1) {
        response.status(204).send({
          msg: `The ${comment_id} has been deleted.`,
        });
      } else if (rows.length === 0) {
        response.status(400).send({
          msg: "Unable to delete as comment id not found.",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
};
