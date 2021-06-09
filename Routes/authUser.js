const { Router } = require("express");
const router = Router();
const authenticationController = require("../Controllers/authenticationController");

//login-user
router.post("/login", authenticationController.login_user);
router.post("/register", authenticationController.create_user);
router.get(
  "/get/check/email/:email",
  authenticationController.check_email_in_use
);
router.post("/verify", authenticationController.verify_email_address);

module.exports = router;
