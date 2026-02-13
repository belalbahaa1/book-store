const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db.js");

const cookieParser = require("cookie-parser");

app.use(cookieParser());
connectDB();
const allowedOrigins = [
  "http://localhost:5173",
  "https://book-store-wjp7.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
