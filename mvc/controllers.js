const { fetchCategories } = require("./models");

exports.categoryObjects = (request, response) => {
  fetchCategories().then((category) => {
    response.status(200).send({ category });
  });
};
