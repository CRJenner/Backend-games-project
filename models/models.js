const db = require("../db/data/development-data/index");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.fetchReviews = (review_id) => {
  return db
    .query(
      `SELECT reviews.*,
    COUNT(comments.review_id)::INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments
    ON reviews.review_id =comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`,
      [review_id]
    )
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
      if (!inc_votes || typeof inc_votes !== "number") {
        return Promise.reject({
          status: 400,
          msg: "Invalid input, use a number",
        });
      }
      return updateReviews[0];
    });
};

exports.fetchAllReviews = (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  const sortedQuery = [
    "title",
    "designer",
    "owner",
    "review_body",
    "category",
    "votes",
    "created_at",
  ];
  const orderQuery = ["asc", "desc"];
  let intitialQuery = `SELECT reviews.*,
COUNT (comments.review_id) ::INT 
AS comment_count
FROM reviews 
LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  if (category) {
    (intitialQuery += `WHERE category = $1
      GROUP BY reviews.review_id
      ORDER BY reviews.${sort_by} ${order};`),
      [category];
  } else if (!category)
    intitialQuery += `  GROUP BY reviews.review_id
      ORDER BY reviews.${sort_by} ${order};`;
  return db.query(intitialQuery).then(({ rows: review }) => {
    if (!sortedQuery.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid sort query, try again",
      });
    } else if (!orderQuery.includes(order)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid order query , try again",
      });
    }
    return review;
  });
};

exports.fetchAllComments = (review_id) => {
  return db
    .query(
      `SELECT *
FROM comments
WHERE review_id = $1
ORDER BY created_at DESC;`,
      [review_id]
    )
    .then(({ rows: comments }) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Review ID not found, try another number.",
        });
      }
      return comments;
    });
};

exports.postedComment = (username, body, review_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, review_id)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [username, body, review_id]
    )
    .then(({ rows: comment }) => {
      if (
        username === undefined ||
        body === undefined ||
        username.length === 0 ||
        body.length === 0
      ) {
        return Promise.reject({
          status: 400,
          msg: "Please enter a comment and username",
        });
      }
      return comment[0];
    });
};
