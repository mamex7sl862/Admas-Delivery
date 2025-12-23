const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Order = require("../models/Order");

const router = express.Router();

// GET favorites
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add/remove favorite
router.post("/favorites/:itemId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const itemId = req.params.itemId;
    const index = user.favorites.indexOf(itemId);
    if (index > -1) {
      user.favorites.splice(index, 1); // remove
    } else {
      user.favorites.push(itemId); // add
    }
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST reorder past order
router.post("/reorder/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.json(order.items); // Return items to add to cart
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
