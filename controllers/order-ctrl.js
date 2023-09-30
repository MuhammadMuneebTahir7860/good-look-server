const orderModel = require("../models/order-model");
const Order = require("../models/order-model");
const UserModel = require("../models/user-model");
const SendEmail = require("../utilis/SendEmail");
const asyncHandler = require("../utilis/asyncHandler");

const Stripe = require("stripe")(
  "sk_test_51LzN7gKuTiMVlxYm4tlDbupOJyX5PUVxUfeixsFvpKSidpUIj1ZDmyZmNuIcBQaT4dAUGSGvyF1X1CSwHNiErVYV003C4MK1IO"
);


module.exports.addAppointment = async (req, res) => {

  try {
    let newData = {
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      email: req.body.email,
      service: req.body.service
    }
    let resValue = await Order.create(req.body)
    console.log(resValue, 'resValye');
    // await resValue.save();
    res.status(200).json({ data: resValue });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ data: error.message });
  }
};


module.exports.paymentCharge = async (req, res) => {
  const { token, amount, userId, product, sellerId } = req.body;
  console.log(userId, sellerId);
  try {
    const stripeCharge = await Stripe.charges.create({
      source: token.id,
      amount,
      currency: "usd",
    });
    const payment = new Order({
      amount: stripeCharge.amount / 100,
      userId: userId,
      billingDetail: stripeCharge,
      productId: product?._id,
      sellerId: sellerId,
      createdAt: new Date(),
    });

    await payment.save();
    res.status(200).json({ data: payment });
  } catch (error) {
    res.status(500).json({ error: "Payment failed." });
  }
};

module.exports.getAllOrders = asyncHandler(async (req, res) => {
  try {
    const response = await Order.find()
      .populate("userId", "name email contact") // Populate user data for userId and fetch only 'username' and 'email' fields
      .populate("sellerId", "name email") // Populate user data for sellerId and fetch only 'username' and 'email' fields
      .populate("productId", "title price"); // Populate product data for productId and fetch only 'name' and 'price' fields
    console.log(response, "response");
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports.updateOrder = async (req, res) => {
  const data = req.body.data;
  try {
    if (data?._id) {
      const orderData = await Order.findByIdAndUpdate(data?._id, data, {
        new: true,
      });

      if (orderData?.paymentApproved === true) {
        const seller = await UserModel.findById(orderData?.sellerId);
        const text = `Thanks For Using Our Services Please Get Your payment ${data?.img}`;
        await SendEmail(seller.email, "Thanks for Using Our Services", text);
      }
      return res.status(200).json({ msg: "Updated!", data: orderData });
    }
    return res.status(401).json({ msg: "Not found" });
  } catch (error) {
    res.status(200).send(error);
  }
};

module.exports.deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id) {
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Deleted!" });
  }
  return res.status(401).json({ msg: "Not found" });
});

module.exports.getSales = asyncHandler(async (req, res) => {
  try {
    const allSales = await Order.find({ sellerId: req.user._id })
      .populate("sellerId", "name email") // Populate user data for sellerId and fetch only 'username' and 'email' fields
      .populate("productId", "title price");
    res.status(200).json({ data: allSales });
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports.getPurchase = asyncHandler(async (req, res) => {
  try {
    const allSales = await Order.find({ userId: req.user._id })
      .populate("sellerId", "name email") // Populate user data for sellerId and fetch only 'username' and 'email' fields
      .populate("productId", "title price");
    res.status(200).json({ data: allSales });
  } catch (error) {
    res.status(400).send(error);
  }
});
