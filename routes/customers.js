const express = require("express"),
  router = express.Router();
  const auth = require("../middleware/auth");

const {Customer,validateCustomer} = require('../models/customer');


router.get("/", auth, async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});


router.post("/", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    // id: genres.length + 1,
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  // genres.push(genre);
  await customer.save();
  res.send(customer);
});

router.get("/:id", auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!customer) return res.status(404).send("Customer with the given id not found");
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    {
      new: true,
    }
  );

  // const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!customer)
    return res.status(404).send("Customer with the given id not found");

  // genre.name = req.body.name;
  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // const genre = genres.find((g) => g.id === parseInt(req.params.id));

  if (!customer)
    return res.status(404).send("Customer with the given id not found");
  // const index = genres.indexOf(genre);
  // genres.splice(index, 1);
  res.send(customer);
});



module.exports = router;