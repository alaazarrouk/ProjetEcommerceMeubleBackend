const { Router } = require("express");
const router = Router();
const orderController = require("../Controllers/orderController");
const { verifyJWT } = require("./verfiyJwt");

//create order
router.post("/create/order", verifyJWT, orderController.create_order);

//get all orders
router.get("/get/orders", verifyJWT, orderController.get_orders);

//get orders stats
router.get("/get/orders/stats", verifyJWT, orderController.get_orders_stats);

//get count orders
router.get("/get/orders/count", verifyJWT, orderController.get_orders_count);

//get user orders
router.get("/get/user/orders/:id", verifyJWT, orderController.get_user_orders);

//get order by id
router.get("/get/order/:id", verifyJWT, orderController.get_order_by_id);

//get user orders by date
router.get(
  "/get/user/orders/date/:date/:id",
  verifyJWT,
  orderController.get_user_order_by_date
);
//get user orders by date
router.get(
  "/get/orders/date/:date",
  verifyJWT,
  orderController.get_order_by_date
);
//get order by status
router.get(
  "/get/orders/status/:status",
  verifyJWT,
  orderController.get_order_by_status
);

//get gains
router.get("/get/gains", verifyJWT, orderController.get_gains);

//confirm order
router.patch("/confirm/order/:id", verifyJWT, orderController.confirm_order);

//cancel order
router.patch("/cancel/order/:id", verifyJWT, orderController.cancel_order);

module.exports = router;
