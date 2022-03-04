const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");
const request = require("supertest");
const moment = require('moment');

describe("/api/returns", () => {
  let server, customerId, movieId, rental, token,movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ movieId,customerId });
  };
  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: 'The Enternals',
      dailyRentalRate: 2,
      genre: { name: 'Action' },
      numberInStock: 10
    });

   await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "David",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "movie title",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  it("should return 401 if client isn't logged in", async () => {
    token = '';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return a 400 if customerId isn't provided", async () => {
    customerId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return a 400 if movieId isn't provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  }); 

  it("should return a 404 if no rental found for the customer/movie", async () => {
 await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return a 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return a 200 if we have a valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

 it("should set the returnDate if input is valid", async () => {
   const res = await exec();

   const rentalInDb = await Rental.findById(rental._id);
   const diff = new Date() - rentalInDb.dateReturned;
   expect(diff).toBeLessThan(10 * 1000);
 });

 it("should set the rentalFee if input is valid", async () => {
   rental.dateOut = moment().add(-7, "days").toDate();
   await rental.save();

   const res = await exec();

   const rentalInDb = await Rental.findById(rental._id);
   expect(rentalInDb.rentalFee).toBe(14);
 });

 it("should increase the movie stock if input is valid", async () => {
   const res = await exec();

   const movieInDb = await Movie.findById(movieId);
   expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
 });
  
 it("should return the rental if input is valid", async () => {
   const res = await exec();

   const rentalInDb = Rental.findById(rental._id);  

   expect(Object.keys(res.body)).toEqual(
     expect.arrayContaining([
       "dateOut",
       "dateReturned",
       "rentalFee",
       "customer",
       "movie",
     ])
   );
 });
});
