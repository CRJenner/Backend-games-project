const {
  fetchEndpoints,
  fetchCategories,
  fetchReviews,
  fetchUsers,
  updateReviews,
  fetchAllReviews,
  fetchAllComments,
  postedComment,
  removeComment,
} = require("../models/models");

exports.getEndpoints = (request, response, next) => {
  fetchEndpoints().then((endpoint) => {
    console.log(endpoint);
    response.status(200).send(endpoint);
  });
};

exports.categoryObjects = (request, response, next) => {
  fetchCategories()
    .then((category) => {
      response.status(200).send({ category });
    })
    .catch((err) => {
      next(err);
    });
};

exports.reviewObject = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviews(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.collectUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUpdateReviews = (request, response, next) => {
  const { review_id } = request.params;
  const { inc_votes } = request.body;
  updateReviews(review_id, inc_votes)
    .then((updatedReview) => {
      response.status(200).send(updatedReview);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (request, response, next) => {
  const { sort_by, order, category } = request.query;
  fetchAllReviews(sort_by, order, category)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

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
