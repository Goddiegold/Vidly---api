// const express = require("express"),
//   router = express.Router();
// const { Rental } = require("../models/rental");
// const { Movie } = require("../models/movie");
// const auth = require("../middleware/auth");
// const moment = require("moment");

// router.post("/", auth, async (req, res) => {
//   if (!req.body.customerId)
//     return res.status(400).send("customerId isn't provided");
//   if (!req.body.movieId) return res.status(400).send("movieId isn't provided");

//   const rental = await Rental.findOne({
//     "customer._id": req.body.customerId,
//     "movie._id": req.body.movieId,
//   });

//   if (!rental) return res.status(404).send("Rental not found");
//   if (rental.dateReturned)
//     return res.status(400).send("Return already processed.");

//   rental.dateReturned = new Date();
//   const rentalDays = moment().diff(rental.dateOut, "days");
//   rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
//   await rental.save();
//   await Movie.updateOne(
//     { _id: rental.movie._id },
//     {
//       $inc: { numberInStock: 1 },
//     }
//   );

//   return res.status(200).send(rental);
// });

// module.exports = router;

const Joi = require("joi");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.return();
  await rental.save();

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;

