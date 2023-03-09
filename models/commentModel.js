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
    if (isNaN(review_id)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid review id",
      });
    }
    if (!username || !body) {
      return Promise.reject({
        status: 400,
        msg: "Please enter a comment and username",
      });
    }
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Review Id not found",
          });
        }
        return db
          .query(
            `INSERT INTO comments (author, body, review_id)
             VALUES ($1, $2, $3)
             RETURNING *;`,
            [username, body, review_id]
          )
          .then((result) => {
            return result.rows[0];
          });
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
  