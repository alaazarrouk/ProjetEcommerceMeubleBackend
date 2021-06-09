const { Router } = require("express");
const router = Router();
const productController = require("../Controllers/productController");
const { verifyJWT } = require("./verfiyJwt");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

//create product
router.post(
  "/create/product",
  verifyJWT,
  upload.single("image"),
  productController.create_product
);
//get products
router.get("/get/products", verifyJWT, productController.get_Products);
//get products by categorie:
router.get(
  "/get/products/:categorie",
  verifyJWT,
  productController.get_Products_by_categorie
);

//get products by title or id:
router.get(
  "/get/products/search/:requested/:method",
  verifyJWT,
  productController.get_Products_by_title_or_id
);

//get count products
router.get(
  "/get/count/products",
  verifyJWT,
  productController.get_count_Products
);

//get popular products
router.get("/get/popular/products", productController.get_Popular_Products);

router.patch(
  "/update/product/:id",
  verifyJWT,
  upload.single("image"),
  productController.update_Product
);
router.delete(
  "/delete/product/:id/:image",
  verifyJWT,
  productController.delete_Product
);

module.exports = router;
