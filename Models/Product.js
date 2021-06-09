const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  material: {
    type: String,
  },
  dimension: {
    type: String,
  },
  categorie: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
  },
  image: {
    type: String,
  },
  nb_Orders: {
    type: Number,
  },
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
