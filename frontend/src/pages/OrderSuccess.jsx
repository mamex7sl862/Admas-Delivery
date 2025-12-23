import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const OrderSuccess = ({ orderId }) => {
  // Assume orderId passed from Checkout
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center mt-16">
      <FiCheckCircle size={120} className="text-green-500 mx-auto mb-8" />
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Order Confirmed!
      </h1>
      <p className="text-xl text-gray-600 mb-4">
        Thank you for your order. Your delicious food is being prepared.
      </p>
      <p className="text-lg text-gray-500 mb-12">
        Estimated delivery: 30-45 minutes
      </p>
      <Link
        to="/tracking"
        state={{ order: location.state?.order }}
        className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition inline-block mr-4"
      >
        Track Order
      </Link>
      <Link
        to="/menu"
        className="bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition inline-block"
      >
        Order Again
      </Link>
    </div>
  );
};

export default OrderSuccess;
