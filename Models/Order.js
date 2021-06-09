const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: Object,
  },
  products: {
    type: Array,
  },
  total: {
    type: String,
  },
  payment_method: {
    type: String,
  },
  date: {
    type: String,
  },
  status: {
    type: String,
  },
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
