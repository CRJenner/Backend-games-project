const {fetchReviews,
    updateReviews,
    fetchAllReviews
} = require('../models/models')

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