const fs = require("fs/promises");

exports.fetchEndpoints = () => {
  console.log("model");
  return fs.readFile("./endpoints.json").then((endpoints) => {
    console.log(endpoints);
    return JSON.parse(endpoints);
  });
};