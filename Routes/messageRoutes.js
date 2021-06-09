const { Router } = require("express");
const router = Router();
const messageController = require("../Controllers/messageController");
const { verifyJWT } = require("./verfiyJwt");

//create messages
router.post("/create/message", messageController.create_message);

//send mail
router.post("/send/mail/:email/:id", messageController.send_mail);

//get all messages
router.get("/get/messages", verifyJWT, messageController.get_messages);

//get messages stats
router.get(
  "/get/messages/stats",
  verifyJWT,
  messageController.get_messages_stats
);

//get user messages
router.get(
  "/get/user/messages/:email",
  verifyJWT,
  messageController.get_user_messages
);

//get user orders by date
router.get(
  "/get/messages/date/:date",
  verifyJWT,
  messageController.get_messages_by_date
);
//get messages by status
router.get(
  "/get/messages/status/:status",
  verifyJWT,
  messageController.get_messages_by_status
);

//confirm message
router.patch(
  "/confirm/message/:id",
  verifyJWT,
  messageController.confirm_message
);

//cancel message
router.patch(
  "/cancel/message/:id",
  verifyJWT,
  messageController.cancel_message
);

module.exports = router;
