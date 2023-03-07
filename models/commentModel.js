const db = require("../db/connection");


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
  
  exports.removeComment = (comment_id) => {
    return db
      .query(`DELETE FROM comments WHERE comment_id = $1  RETURNING *;`, [
        comment_id,
      ])
      .then(({ rows }) => {
        return rows;
      });
  };
  