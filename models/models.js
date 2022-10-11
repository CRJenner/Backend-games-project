const db = require("../db/data/development-data/index");

exports.fetchCategories = () => {
  if (!"/api/categories") {
    return Promise.reject({
      status: 404,
      msg: `Not a valid path`,
    });
  } else {
    return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
      return rows;
    });
  }
};

exports.fetchReviews = (review_id) => {
  console.log("in the model");
  // if (isNaN(review_id) === true) {
  //   return Promise.reject({
  //     status: 400,
  //     msg: "Invalid input, use a number",
  //   });
  // }
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows: review }) => {
      if (review.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Review ID not found, try another number.",
        });
      }
      return review[0];
    });
};
