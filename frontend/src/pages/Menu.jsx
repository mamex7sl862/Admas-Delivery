import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaStar } from "react-icons/fa";
import useCartStore from "../store/cartStore"; // <-- import your store

const Menu = () => {
  const { user } = useAuth();
  const { addItem } = useCartStore(); // <-- get addItem function from store
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRating, setSelectedRating] = useState({});
  const [comment, setComment] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("/api/menu");
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  // Submit a review
  const handleSubmitReview = async (itemId) => {
    if (!user) {
      alert("Please login to submit a review.");
      return;
    }

    if (!selectedRating[itemId]) {
      alert("Please select a rating before submitting.");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [itemId]: true }));

    try {
      await axios.post(`/api/menu/${itemId}/review`, {
        rating: selectedRating[itemId],
        comment: comment[itemId] || "",
      });

      // Reset inputs
      setSelectedRating((prev) => ({ ...prev, [itemId]: 0 }));
      setComment((prev) => ({ ...prev, [itemId]: "" }));

      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmitting((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Add to cart using the store
  const handleAddToCart = (item) => {
    addItem(item);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Our Menu</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.desc}</p>
              <p className="text-3xl font-bold text-orange-600 mb-2">
                ${item.price}
              </p>
              <p className="text-gray-700 mb-4">
                Average Rating: {item.averageRating.toFixed(1)} ⭐ (
                {item.reviews.length} reviews)
              </p>

              {/* Add to Cart */}
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mb-4"
              >
                Add to Cart
              </button>

              {/* User Rating */}
              {user && (
                <div className="mb-4">
                  <p className="font-semibold mb-1">Rate this item:</p>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={24}
                        className={`cursor-pointer mr-1 ${
                          star <= (selectedRating[item._id] || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() =>
                          setSelectedRating((prev) => ({
                            ...prev,
                            [item._id]: star,
                          }))
                        }
                      />
                    ))}
                  </div>
                  <textarea
                    placeholder="Leave a comment (optional)"
                    value={comment[item._id] || ""}
                    onChange={(e) =>
                      setComment((prev) => ({
                        ...prev,
                        [item._id]: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full border rounded-xl px-3 py-2 mb-2"
                  />
                  <button
                    onClick={() => handleSubmitReview(item._id)}
                    disabled={submitting[item._id]}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                  >
                    {submitting[item._id] ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}

              {/* Show all reviews */}
              {item.reviews.length > 0 && (
                <div className="mt-4 border-t pt-2">
                  <h4 className="font-semibold mb-2">Reviews:</h4>
                  {item.reviews.map((rev, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-sm font-medium">{rev.rating} ⭐</p>
                      {rev.comment && (
                        <p className="text-gray-700">{rev.comment}</p>
                      )}
                      <p className="text-gray-400 text-xs">
                        {new Date(rev.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
