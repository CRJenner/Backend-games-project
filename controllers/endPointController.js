const {
    fetchEndpoints
  } = require("../models/endPointsModel");
  

exports.getEndpoints = (request, response, next) => {
    fetchEndpoints().then((endpoint) => {
      response.status(200).send({endpoint});
    })
    .catch((error) => {
        next(error)
    })  };
  