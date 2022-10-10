const express = require("express");
const { categoryObjects } = require("./mvc/controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", categoryObjects);

module.exports = app;
