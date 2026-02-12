const express = require("express");
const router = express.Router();
const Category = require("../models/CategorySchema");

router.post("/createCategory", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "name is  required!" });
    }

    const newCategory = new Category({
      name,
    });

    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully!!",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all categories
router.get("/getCategory", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete category
router.delete("/deleteCategory/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
