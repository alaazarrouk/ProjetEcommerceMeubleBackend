const Categorie = require("../Models/Categorie");
const Product = require("../Models/Product");
var fs = require("fs");
const create_categorie = async (req, res) => {
  try {
    const image = req.file.filename;
    const title = req.body.title;
    const categorie = await Categorie.create({ title, image });
    return res.status(200).send(categorie);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};
const get_Categories = async (req, res) => {
  const ArrayCategories = [];
  try {
    const categories = await Categorie.find();
    for (var i = 0; i < categories.length; i++) {
      var countCategorieProducts = await Product.find({
        categorie: categories[i].title,
      }).countDocuments();
      ArrayCategories.push({
        _id: categories[i]._id,
        title: categories[i].title,
        image: categories[i].image,
        nb_products: countCategorieProducts,
      });
    }
    return res.status(200).send(ArrayCategories);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};
const update_Categorie = async (req, res) => {
  try {
    const title = req.body.title;
    const lastImage = req.body.lastImage;
    if (lastImage == undefined || title == "") {
      if (lastImage == undefined) {
        var updatedCategorie = await Categorie.updateOne(
          { _id: req.params.id },
          {
            $set: {
              title,
            },
          }
        );
      } else {
        var image = req.file.filename;
        var updatedCategorie = await Categorie.updateOne(
          { _id: req.params.id },
          {
            $set: {
              image,
            },
          }
        );
        fs.unlinkSync(`./images/${lastImage}`);
      }
    } else {
      console.log("im here if there both");
      var image = req.file.filename;
      var updatedCategorie = await Categorie.updateOne(
        { _id: req.params.id },
        {
          $set: {
            title,
            image,
          },
        }
      );
      fs.unlinkSync(`./images/${lastImage}`);
    }

    return res.status(200).send(updatedCategorie);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};
const delete_Categorie = async (req, res) => {
  try {
    fs.unlinkSync(`./images/${req.params.image}`);
    const categorieDeleted = await Categorie.deleteOne({ _id: req.params.id });
    /* const products = await Product.find();
    for (var i = 0; i < products.length; i++) {
      fs.unlinkSync(`./images/${products[i].image}`);
    }
    const deletedProducts = await Product.deleteMany({
      categorie: req.params.title,
    });*/
    return res.status(200).send(categorieDeleted);
  } catch (err) {
    console.log("categorieDeleted err" ,err);
    return res.status(404).json(err.message);
  }
};
module.exports = {
  create_categorie,
  get_Categories,
  update_Categorie,
  delete_Categorie,
};
