const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/User");

// POST - Create new order
router.post("/", async (req, res) => {
  try {
    const {
      items,
      total,
      deliveryFee = 5.99,
      name,
      phone,
      address,
      notes = "",
      userId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }
    if (!name || !phone || !address) {
      return res
        .status(400)
        .json({ msg: "Name, phone, and address are required" });
    }

    const order = new Order({
      user: userId || null,
      items,
      total,
      deliveryFee,
      name,
      phone,
      address,
      notes,
    });

    await order.save();

    // ← ADD THIS: Update totalSpent
    if (userId) {
      await User.findByIdAndUpdate(userId, { $inc: { totalSpent: total } });
    }

    const io = req.app.get("io");
    if (io) io.emit("newOrder", order);

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to save order", error: err.message });
  }
});
// GET - All orders (admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - User's orders (for "My Orders" page)
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Pending",
      "Preparing",
      "On the way",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(order._id.toString()).emit("statusUpdate", status);
      io.emit("orderUpdated", order);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
