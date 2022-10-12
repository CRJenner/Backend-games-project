const db = require("../db/data/development-data/index");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.fetchReviews = (review_id) => {
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

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
    return users;
  });
};

exports.updateReviews = (review_id, inc_votes) => {
  return db
    .query(
      `UPDATE reviews
      SET votes = votes + $1 
      WHERE review_id = $2 
      RETURNING *;`,
      [inc_votes, review_id]
    )
    .then(({ rows: updateReviews }) => {
      if (typeof inc_votes !== "number") {
        return Promise.reject({
          status: 400,
          msg: "Invalid input, use a number",
        });
      }
      console.log(updateReviews[0]);
      return updateReviews[0];
    });
};
