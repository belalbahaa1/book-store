const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema.js");
const Book = require("../models/BookSchema.js");
const Order = require("../models/OrderSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cookieAuth } = require("../auth/middleware.js");
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, and name are required!" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role: "user",
    });

    await newUser.save();

    let token = jwt.sign(
      { email, id: newUser._id, role: newUser.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "4w",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      message: "User registered Successfully",
      user: newUser,
      token,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }

  let user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const role = (user.role || "user").trim();
    let token = jwt.sign(
      { email, id: user._id, role },
      process.env.SECRET_KEY,
      {
        expiresIn: "4w",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const redirectPath = role === "admin" ? "/admin" : "/";
    return res.status(201).json({
      message: "User signed in Successfully",
      user: user,
      token,
      role,
      redirect: redirectPath,
    });
  } else {
    return res.status(400).json({ message: "invalid email or password" });
  }
});

router.get("/verify", cookieAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User is not found" });
    }
    res.status(200).json({
      message: "token valid",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        cart: user.cart,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid Token " });
  }
});

// Update cart item quantity
router.put("/update-cart", cookieAuth, async (req, res) => {
  const { bookId, action } = req.body;
  const { id } = req.user;
  const user = await User.findById(id);
  const itemIndex = user.cart.findIndex(
    (item) => item.bookId.toString() === bookId,
  );

  if (itemIndex > -1) {
    if (action === "increase") {
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });

      if (user.cart[itemIndex].quantity + 1 > book.stock) {
        return res.status(400).json({
          message: `Insufficient stock. Only ${book.stock} available.`,
        });
      }
      user.cart[itemIndex].quantity += 1;
    } else if (action === "decrease") {
      user.cart[itemIndex].quantity -= 1;
      if (user.cart[itemIndex].quantity <= 0) {
        user.cart.splice(itemIndex, 1);
      }
    } else if (action === "remove") {
      user.cart.splice(itemIndex, 1);
    }
    await user.save();
    return res.status(200).json({ message: "Cart updated", cart: user.cart });
  } else {
    return res.status(404).json({ message: "Item not found in cart" });
  }
});

router.put("/add-to-cart", cookieAuth, async (req, res) => {
  const { bookId } = req.body;
  const { id } = req.user;
  const user = await User.findById(id);
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.stock <= 0) {
    return res.status(400).json({ message: "Book is out of stock" });
  }

  const existingItem = user.cart.find(
    (item) => item.bookId.toString() === bookId,
  );
  if (existingItem) {
    if (existingItem.quantity + 1 > book.stock) {
      return res
        .status(400)
        .json({ message: `Insufficient stock. Only ${book.stock} available.` });
    }
    existingItem.quantity += 1;
  } else {
    user.cart.push({ bookId });
  }

  await user.save();
  return res.status(200).json({ message: "Book added to cart" });
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Logout failed" });
  }
});

router.post("/checkout", cookieAuth, async (req, res) => {
  try {
    const { id } = req.user;
    const { location, phoneNumber } = req.body;

    if (!location || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Location and phone number are required" });
    }

    const user = await User.findById(id).populate("cart.bookId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Check stock and calculate total
    for (const item of user.cart) {
      const book = item.bookId;
      if (!book) {
        return res.status(404).json({ message: "One or more books not found" });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}`,
        });
      }
      totalAmount += book.price * item.quantity;
      orderItems.push({
        bookId: book._id,
        quantity: item.quantity,
        price: book.price,
      });
    }

    // Create Order
    const newOrder = new Order({
      userId: id,
      items: orderItems,
      totalAmount,
      location,
      phoneNumber,
    });

    await newOrder.save();

    // Update Book Stock and Clear Cart
    for (const item of user.cart) {
      await Book.findByIdAndUpdate(item.bookId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    user.cart = [];
    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed. Please try again." });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  return res.status(200).json({ user });
});

module.exports = router;
