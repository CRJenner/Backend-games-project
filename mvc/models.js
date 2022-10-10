const db = require("../db/data/development-data/index");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};
