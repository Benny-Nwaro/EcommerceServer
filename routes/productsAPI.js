const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Product = require("../models/product");
const auth = require("../middleware/authorization");

router.post(
  "/",
  [
    auth,
    [
      check("name", "Product name is required").not().isEmpty(),
      check("description", "Product description is required").not().isEmpty(),
      check("category", "Product category is required").not().isEmpty(),
      check("price", "Product price is required").not().isEmpty(),
      check("quantity", "Product quantity is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() }).status(400);
    }
    try {
      const { name, description, category, price, brand, quantity } = req.body;
      const newProduct = new Product({
        userId: req.user.id,
        name,
        description,
        category,
        price,
        brand,
        quantity,
      });
      const product = await newProduct.save();
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.send("server error").status(400);
    }
  },
);
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.send("server error").status(400);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.json({ msg: "product not found" }).status(400);
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.send("server error").status(400);
  }
});

router.get("/instructors/:id", auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.params.id });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
