const express = require("express");
const { protect } = require("../middlewares/auth");

const Order = require("../controllers/order-ctrl");

const router = express.Router();

router.post("/charge", Order.paymentCharge);
router.get("/getAllOrders", Order.getAllOrders);
router.put("/updateOrder", Order.updateOrder);
router.delete("/deleteOrder/:id", Order.deleteOrder);
router.get("/getSales", protect("user"), Order.getSales);
router.get("/getPurchase", protect("user"), Order.getPurchase);

module.exports = router;
