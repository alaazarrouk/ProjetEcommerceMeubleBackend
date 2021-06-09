const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Categorie = mongoose.model("categorie", categorieSchema);
module.exports = Categorie;
