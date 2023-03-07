const {fetchCategories} = require("../models/categoryModel")

exports.categoryObjects = (request, response, next) => {
    fetchCategories()
      .then((category) => {
        response.status(200).send({ category });
      })
      .catch((err) => {
        next(err);
      });
  };