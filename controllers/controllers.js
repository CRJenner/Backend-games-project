const {
  fetchCategories,
  fetchReviews,
  fetchUsers,
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
