const {
  fetchCategories,
  fetchReviews,
  fetchUsers,
  updateReviews,
  fetchAllReviews,
} = require("../models/models");

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
    .catch(next);
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
  const { category } = request.query;
  fetchAllReviews(category)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
