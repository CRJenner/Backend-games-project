const db = require("../db/connection");


exports.fetchReviewsById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*,
    COUNT(comments.review_id)::INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
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

exports.updateReviews = (review_id, inc_votes) => {
   if (!inc_votes || typeof inc_votes !== "number") {
        return Promise.reject({
          status: 400,
          msg: "Invalid voting",
        });
      }
  return db
    .query(
      `UPDATE reviews
      SET votes = votes + $1 
      WHERE review_id = $2 
      RETURNING *;`,
      [inc_votes, review_id]
    )
    .then(({ rows: updateReviews }) => {
      if(updateReviews.length===0){
        return Promise.reject({
            status: 404,
            msg: "Review id not found"
        }) 
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
  const paramQuery = [];
  const orderQuery = ["asc", "desc"];
  let intitialQuery = `SELECT reviews.*,
COUNT (comments.review_id) ::INT 
AS comment_count
FROM reviews 
LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  if (category) {
    paramQuery.push(category);
    intitialQuery += ` WHERE category = $1
      GROUP BY reviews.review_id
      ORDER BY reviews.${sort_by} ${order};`;
  } else if (!category)
    intitialQuery += `  GROUP BY reviews.review_id
      ORDER BY reviews.${sort_by} ${order};`;
  return db.query(intitialQuery, paramQuery).then(({ rows: review }) => {
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
    } else if (review.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Invalid category query, try again",
      });
    }
    return review;
  });
};

