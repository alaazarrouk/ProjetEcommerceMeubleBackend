const { Router } = require("express");
const router = Router();
const categorieController = require("../Controllers/categorieController");

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const { verifyJWT } = require("./verfiyJwt");

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

//create categorie
router.post(
  "/create/categorie",
  verifyJWT,
  upload.single("image"),
  categorieController.create_categorie
);

//get categories
router.get("/get/categories", categorieController.get_Categories);
//update categorie
router.patch(
  "/update/categorie/:id",
  verifyJWT,
  upload.single("image"),
  categorieController.update_Categorie
);
//delete categorie
router.delete(
  "/delete/categorie/:id/:image/:title",
   verifyJWT,
  categorieController.delete_Categorie
);

module.exports = router;
