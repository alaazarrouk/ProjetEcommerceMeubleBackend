const Product = require("../Models/Product");
const Order = require("../Models/Order");
var fs = require("fs");

const create_product = async (req, res) => {
  try {
    const {
      title,
      material,
      dimension,
      categorie,
      description,
      price,
    } = req.body;
    const image = req.file.filename;
    const nb_Orders = 0;
    const product = await Product.create({
      title,
      material,
      dimension,
      categorie,
      description,
      price,
      image,
      nb_Orders,
    });
    return res.status(201).send(product);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};
const get_count_Products = async (req, res) => {
  try {
    const countProducts = await Product.find().countDocuments();
    return res.status(200).send({ countProducts });
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};
const get_Products = async (req, res) => {
  try {
    const Products = await Product.find().sort({ nb_Orders: -1 });
    return res.status(200).send(Products);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};

const get_Products_by_categorie = async (req, res) => {
  try {
    if (req.params.categorie === "All") {
      var products = await Product.find({});
    } else {
      var products = await Product.find({ categorie: req.params.categorie });
    }

    return res.status(200).send(products);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};

const get_Products_by_title_or_id = async (req, res) => {
  try {
    const method = req.params.method;
    const requested = req.params.requested;
    if (method == "Identifiant") {
      if (requested.match(/^[0-9a-fA-F]{24}$/)) {
        var products = await Product.find({
          _id: requested,
        });
      } else {
        return res.status(200).send([]);
      }
    } else {
      var products = await Product.find({
        title: { $regex: requested, $options: "i" },
      });
    }

    return res.status(200).send(products);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};

const get_Popular_Products = async (req, res) => {
  try {
    const Products = await Product.find().sort({ nb_Orders: -1 }).limit(2);
    return res.status(200).send(Products);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};

const update_Product = async (req, res) => {
  try {
    const {
      title,
      material,
      dimension,
      categorie,
      description,
      price,
      lastImage,
    } = req.body;

    if (lastImage == undefined) {
      var updatedProduct = await Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            title,
            material,
            dimension,
            categorie,
            description,
            price,
          },
        }
      );
    } else {
      var image = req.file.filename;
      var updatedProduct = await Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            title,
            material,
            dimension,
            categorie,
            description,
            price,
            image,
          },
        }
      );
      fs.unlinkSync(`./images/${lastImage}`);
    }

    return res.status(200).send(updatedProduct);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};
const delete_Product = async (req, res) => {
  try {
    fs.unlinkSync(`./images/${req.params.image}`);
    const productDeleted = await Product.deleteOne({ _id: req.params.id });

    return res.status(200).send(productDeleted);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};

module.exports = {
  create_product,
  get_count_Products,
  get_Products,
  get_Products_by_categorie,
  get_Products_by_title_or_id,
  get_Popular_Products,
  update_Product,
  delete_Product,
};
