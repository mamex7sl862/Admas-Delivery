const express = require("express");
const MenuItem = require("../models/MenuItem");
const auth = require("../middleware/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "admas-delivery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage: storage });

// GET all menu items (seed if empty)
router.get("/", async (req, res) => {
  try {
    const count = await MenuItem.countDocuments();
    if (count === 0) {
      const items = [
        {
          category: "Burger",
          name: "Classic Cheese Burger",
          desc: "Juicy beef patty with cheddar, lettuce, tomato",
          price: 12.99,
          img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        },
        {
          category: "Pizza",
          name: "Margherita Pizza",
          desc: "Classic tomato, mozzarella & basil",
          price: 15.99,
          img: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600",
        },
        {
          category: "Pasta",
          name: "Spaghetti Carbonara",
          desc: "Creamy pasta with pancetta & parmesan",
          price: 13.99,
          img: "https://images.unsplash.com/photo-1603133872873-fc0f4163e6a2?w=600",
        },
        {
          category: "Drinks",
          name: "Fresh Orange Juice",
          desc: "100% natural orange juice",
          price: 4.5,
          img: "https://images.unsplash.com/photo-1571091718767-1b9f6d99e4e5?w=600",
        },
        {
          category: "Desserts",
          name: "Chocolate Cake",
          desc: "Rich chocolate cake with ganache",
          price: 6.99,
          img: "https://images.unsplash.com/photo-1599785209707-2c8b39e6f1d0?w=600",
        },
      ];
      await MenuItem.insertMany(items);
      console.log("Menu seeded");
    }
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add menu item (Admin)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { category, name, desc, price } = req.body;
    let img = req.body.img || "";

    if (req.file) img = req.file.path;

    const newItem = new MenuItem({
      category,
      name,
      desc,
      price: Number(price),
      img,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update menu item (Admin)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      category: req.body.category,
      name: req.body.name,
      desc: req.body.desc,
      price: Number(req.body.price),
    };
    if (req.file) updateData.img = req.file.path;
    else if (req.body.img) updateData.img = req.body.img;

    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE menu item (Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST review/rating (User)
router.post("/:id/review", auth, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Menu item not found" });

    const existing = item.reviews.find(
      (r) => r.user.toString() === req.user.id
    );
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.date = new Date();
    } else {
      item.reviews.push({ user: req.user.id, rating, comment });
    }

    // update average rating
    const totalRating = item.reviews.reduce((sum, r) => sum + r.rating, 0);
    item.averageRating = totalRating / item.reviews.length;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
