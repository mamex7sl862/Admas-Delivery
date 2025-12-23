import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ← Add this
import { FiMapPin, FiPhone, FiUser, FiHome } from "react-icons/fi";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ← Get logged-in user
  const { items, getTotalPrice, clearCart } = useCartStore();
  const deliveryFee = 5.99;
  const total = getTotalPrice() + deliveryFee;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill Name, Phone, and Address");
      return;
    }

    setLoading(true);

    const orderData = {
      items: items.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        img: item.img,
        quantity: item.quantity,
      })),
      total: getTotalPrice(),
      deliveryFee,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      userId: user ? user.id : null, // ← Send user ID if logged in
    };

    try {
      const res = await axios.post("/api/orders", orderData);
      clearCart();
      navigate(`/tracking/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Delivery Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <FiUser /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <FiPhone /> Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <FiHome /> Delivery Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <FiMapPin /> Order Notes (optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., Ring doorbell, leave at door..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-full text-xl font-semibold transition ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {loading
                ? "Placing Order..."
                : `Place Order – $${total.toFixed(2)}`}
            </button>

            <p className="text-center text-gray-600 mt-4">
              Payment: Cash on Delivery
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-gray-700"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-orange-600 pt-4 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
