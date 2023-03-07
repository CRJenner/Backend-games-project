const {
    fetchUsers
  } = require("../models/usersModel");
  
  exports.collectUsers = (request, response, next) => {
    fetchUsers()
      .then((users) => {
        response.status(200).send({ users });
      })
      .catch((err) => {
        next(err);
      });
  }