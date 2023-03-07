const fs = require("fs/promises");

exports.fetchEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((data) => {
        return JSON.parse(data)
    })
}