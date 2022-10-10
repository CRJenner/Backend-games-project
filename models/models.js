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
