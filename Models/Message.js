const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  email: {
    type: String,
  },
  date: {
    type: String,
  },
  status: {
    type: String,
  },
});

const Message = mongoose.model("message", messageSchema);
module.exports = Message;
