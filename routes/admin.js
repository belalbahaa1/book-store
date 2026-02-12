const express = require("express");
const router = express.Router();
const Book = require("../models/BookSchema");
const multer = require("multer");
const { auth } = require("../auth/middleware");

// uploading the images using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.fieldname;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

// create new book
router.post(
  "/createBook",
  auth("admin"),
  upload.single("coverImage"),
  async (req, res) => {
    try {
      const {
        title,
        author,
        description,
        price,
        stock,
        isFeatured,
        category,
        discountPercent,
        isOnSale,
      } = req.body;
      if (!title || !author || !description || !price || !stock) {
        return res.status(400).json({ error: "All fields are required!" });
      }

      const newBook = new Book({
        title,
        author,
        description,
        price,
        stock,
        isFeatured,
        category,
        isOnSale,
        discountPercent,
        coverImage: req.file?.filename,
      });

      await newBook.save();
      res
        .status(201)
        .json({ message: "Book created successfully!!", book: newBook });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);
// get all books
router.get("/getBooks", auth("admin"), async (req, res) => {
  try {
    const book = await Book.find().populate("category", "name");
    return res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// get specific book by his id
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// update a specific book
router.put("/updateBook/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("category", "name");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book updated successfully!", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteBook", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id).populate(
      "category",
      "name",
    );
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
