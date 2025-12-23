import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user) return;

      try {
        const res = await axios.get("/api/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  // ✅ CORRECT total spent (calculated from orders)
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [orders]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <p className="text-2xl text-gray-600">
          Please log in to see your orders
        </p>
        <Link
          to="/login"
          className="text-orange-600 hover:underline text-xl mt-4 inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <p className="text-2xl text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 mt-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        My Orders
      </h1>

      {/* ✅ Accurate total spent */}
      <p className="text-2xl font-bold text-orange-600 mb-10 text-center">
        Total Spent: ${totalSpent.toFixed(2)}
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600">
            You haven't placed any orders yet
          </p>
          <Link
            to="/menu"
            className="mt-8 inline-block bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition"
          >
            Start Ordering
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">
                  Order #{order._id.slice(-8)} •{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="text-lg font-bold text-orange-600 mt-2">
                  {order.status}
                </p>

                <p className="text-xl font-semibold mt-4">
                  Total: ${order.total.toFixed(2)}
                </p>

                <div className="mt-4">
                  <p className="font-medium">Items:</p>
                  <ul className="text-gray-600 mt-2 space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.quantity}× {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                to={`/tracking/${order._id}`}
                className="mt-6 inline-block text-orange-600 hover:underline font-medium"
              >
                Track Order →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
