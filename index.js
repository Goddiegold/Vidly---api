const express = require("express"),
  app = express();
const winston = require("winston");
const config = require('config');
 
 
require("./startup/logging")();
require("./startup/cors")(app);
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || config.get("port");
const logs = `Listening on port ${port} ...`;
winston.info(logs)
const server = app.listen(port, () => console.log(`info: ${logs}`));
module.exports = server;

