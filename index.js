const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./db");
// const errorHandler = require("./middlewares/errorHandler");
const productRoutes = require("./routes/product-routes");
const userRoutes = require("./routes/user-routes");
const chatRoutes = require("./routes/chatRoutes");
const adminRouter = require("./routes/admin-router");
const messageRoutes = require("./routes/messageRoutes");
const orderRoutes = require("./routes/order-router");
const blogRouter = require("./routes/blog-router");
const serviceRouter = require("./routes/service-router");
const workerRouter = require("./routes/worker-router");
const applySupplierRouter = require("./routes/apply-supplier");
const scheuldeRouter = require("./routes/schedule-router");
const billingRouter = require("./routes/billing-router");
const measurementRouter = require("./routes/mesurement-router");
const dashboardRouter = require("./routes/dashboard-router");
const app = express();
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// app.use(async (req, res, next) => {
//   const apikey = req.headers.apikey;
//   if (apikey == process.env.apikey) {
//     return next();
//   }
//   res.status(404).json({ success: false });
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.use(errorHandler);
app.use("/api", adminRouter);
app.use("/api", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api", orderRoutes);
app.use("/api", blogRouter);
app.use("/api", serviceRouter);
app.use("/api", workerRouter);
app.use("/api", applySupplierRouter);
app.use("/api", scheuldeRouter);
app.use("/api", billingRouter);
app.use("/api", measurementRouter);
app.use("/api", dashboardRouter);

// app.listen(process.env.PORT || 5002, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );

const server = app.listen(process.env.PORT || 5002, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
