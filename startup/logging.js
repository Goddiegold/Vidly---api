const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // winston.exceptions(
  //   // new winston.transports.Console({colorize:true, prettyPrint:true}),
  //   new winston.transports.File({ filename: "uncaughtExceptions.log" })
  // );
  
  // winston.exceptions(); 
  

  process.on("unhandledRejection", (ex) => {
    console.log("WE GOT AN UNHANDLED REJECTION", ex);
    winston.add(new winston.transports.File({
     filename: "unhandledRejection.log",
     level: "error",
    }));
    winston.error(ex.message)
 });

 process.on("uncaughtException", (ex) => {
   console.log("WE GOT AN UNCAUGHT EXCEPTION", ex);
   winston.add(new winston.transports.File({
     filename: "uncaughtException.log",
     level: "error",
   }));
   winston.error(ex.message);
 });
  


  winston.add(
    new winston.transports.File({ filename: "logfile.log", level: "info" }),
    //   new winston.transports.MongoDB({
    //   poolSize: 2,
    //   autoReconnect: true,
    //   useNewUrlParser: true,
    //   useUnifiedTopology:true,
    //   db: "mongodb://localhost:27017/vidly",
    //   collection: "log",
    // })
  );
    // throw new Error("Latest virus");


};
