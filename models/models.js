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
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      console.log(rows[0]);
      return rows[0];
    });
};
