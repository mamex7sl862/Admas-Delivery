const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  category: String,
  name: String,
  desc: String,
  price: Number,
  img: String,
  reviews: [
    // New: Array of reviews
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      date: { type: Date, default: Date.now },
    },
  ],
  averageRating: { type: Number, default: 0 }, // New: Average rating
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
