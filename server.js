const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db.js");

const cookieParser = require("cookie-parser");

app.use(cookieParser());
connectDB();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/users", require("./routes/users.js"));
app.use("/books", require("./routes/books.js"));
app.use("/category", require("./routes/category.js"));
app.use("/images", express.static("public/images"));
app.use("/admin", require("./routes/admin.js"));

// Export the app for Vercel
module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}
