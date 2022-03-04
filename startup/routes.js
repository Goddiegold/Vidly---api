const express = require('express');
const error = require("../middleware/error");
const genres = require("../routes/genres"),
    customers = require("../routes/customers"),
    movies = require("../routes/movies"),
    rentals = require("../routes/rentals"),
    users = require("../routes/users"),
    auth = require("../routes/auth");
    returns = require("../routes/returns");

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/genres", genres);
    app.use("/api/customers", customers);
    app.use("/api/movies", movies);
    app.use("/api/rentals", rentals);
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/api/returns",returns);
    app.use(error);
}