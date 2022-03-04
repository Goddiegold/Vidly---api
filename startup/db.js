const winston = require('winston');
const mongoose = require("mongoose");
const config = require('config');

module.exports = function () {
  const dbUrl = config.get("db");
  let logs;
   mongoose
     .connect(dbUrl, {
      //  useUnifiedTopology: true,
       useNewUrlParser: true,
     })
     .then(() => {
       logs = `Connected to ${dbUrl}, [/^_^/]...`;
       winston.info(logs);
       console.log(`info: ${logs}`)
     })
     .catch((err) => {
      logs=`Couldn't connect to ${dbUrl}, [/^-^/]...`;
    });
}