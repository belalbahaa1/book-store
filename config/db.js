const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
      console.error("MongoDB Connection Error:", err.message);
      // Exit process with failure
      process.exit(1);
    });
};

module.exports = connectDB;
