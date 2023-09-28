// Export mongoose
const mongoose = require("mongoose");

//Assign MongoDB connection string to Uri and declare options settings
const uri =
  "mongodb+srv://muhammadmuneebtahir7860:Muneeb7860@cluster0.qbs0m9c.mongodb.net/";

// Declare a variable named option and assign optional settings
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// Connect MongoDB Atlas using mongoose connect method
mongoose.connect(uri).then(
  () => {
    console.log("Database connection established!");
  },
  (err) => {
    {
      console.log("Error connecting Database instance due to:", err);
    }
  }
);
