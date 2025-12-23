import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from "react-icons/fi";

// Connect to backend socket
const socket = io("http://localhost:5000", { withCredentials: false });

const Tracking = () => {
  const { orderId } = useParams(); // Get orderId from URL: /tracking/:orderId
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order from backend using orderId
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Order not found or failed to load");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Real-time status updates via Socket.io
  useEffect(() => {
    if (order?._id) {
      socket.emit("joinOrder", order._id);

      socket.on("statusUpdate", (newStatus) => {
        setOrder((prev) => ({ ...prev, status: newStatus }));
      });

      socket.on("orderUpdated", (updatedOrder) => {
        setOrder(updatedOrder);
      });
    }

    return () => {
      socket.off("statusUpdate");
      socket.off("orderUpdated");
    };
  }, [order?._id]);

  const statusSteps = [
    { status: "Pending", label: "Order Placed", icon: FiCheckCircle },
    { status: "Preparing", label: "Kitchen Preparing", icon: FiPackage },
    { status: "On the way", label: "Out for Delivery", icon: FiTruck },
    { status: "Delivered", label: "Delivered", icon: FiHome },
  ];

  const currentStepIndex = order
    ? statusSteps.findIndex((step) => step.status === order.status)
    : -1;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <p className="text-2xl text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <p className="text-2xl text-red-600">{error || "Order not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 mt-16">
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
        Track Your Order
      </h1>

      <div className="bg-white rounded-3xl shadow-2xl p-10">
        {/* Order Info */}
        <div className="text-center mb-12">
          <p className="text-xl text-gray-500">
            Order ID: <span className="font-bold">#{order._id.slice(-8)}</span>
          </p>
          <p className="text-4xl font-bold text-orange-600 mt-6">
            {order.status || "Pending"}
          </p>
          <p className="text-lg text-gray-600 mt-4">
            Estimated delivery: 30-45 minutes
          </p>
          <p className="text-lg text-gray-700 mt-2">
            Delivered to: <strong>{order.name}</strong> ({order.phone})
          </p>
          <p className="text-gray-600">{order.address}</p>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-16">
          <div className="flex justify-between items-center">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-all duration-500 ${
                      isCompleted
                        ? "bg-green-500 scale-110"
                        : isCurrent
                        ? "bg-orange-600 scale-125 ring-8 ring-orange-200"
                        : "bg-gray-300"
                    }`}
                  >
                    <Icon />
                  </div>
                  <p
                    className={`mt-4 text-center font-medium text-lg max-w-32 ${
                      isCurrent ? "text-orange-600 font-bold" : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="absolute top-10 left-0 right-0 h-3 bg-gray-200 rounded-full -z-10">
            <div
              className="h-full bg-orange-600 rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: `${
                  currentStepIndex >= 0
                    ? (currentStepIndex / (statusSteps.length - 1)) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Items</h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 border-b"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-xl">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <span className="text-2xl font-bold text-gray-800">Total Paid</span>
            <span className="text-3xl font-bold text-orange-600">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {order.notes && (
          <div className="mt-8 p-4 bg-gray-100 rounded-xl">
            <p className="text-gray-700">
              <strong>Notes:</strong> {order.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
