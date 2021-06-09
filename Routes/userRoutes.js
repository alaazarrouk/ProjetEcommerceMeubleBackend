const { Router } = require("express");
const userController = require("../Controllers/userController");
const router = Router();
const { verifyJWT } = require("./verfiyJwt");
//get All users
router.get("/get/users", verifyJWT, userController.get_users);
//get user by id
router.get("/get/user/id/:id", verifyJWT, userController.get_user_by_id);
//get user by email
router.get(
  "/get/user/search/:email",
  verifyJWT,
  userController.get_user_by_email
);
//get count of users
router.get("/get/users/count", verifyJWT, userController.get_count_Users);
//update user by id
router.patch("/update/user/:id", verifyJWT, userController.update_user);
//delete user by id
router.delete("/delete/user/:id", verifyJWT, userController.delete_user);

module.exports = router;
