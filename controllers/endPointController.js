const {
    fetchEndpoints
  } = require("../models/models");
  

exports.getEndpoints = (request, response, next) => {
    fetchEndpoints().then((endpoint) => {
      console.log(endpoint);
      response.status(200).send(endpoint);
    });
  };
  