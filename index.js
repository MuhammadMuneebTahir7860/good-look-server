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

// app.listen(process.env.PORT || 5002, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );

const server = app.listen(process.env.PORT || 5002, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved;
    socket.to(chat?.chat?._id).emit("message received", newMessageRecieved);
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
