import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  const deliveryFee = 5.99;
  const totalPrice = getTotalPrice() + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center mt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Your Cart is Empty
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/menu"
          className="bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-orange-600 font-bold text-2xl mt-2">
                  ${item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition disabled:opacity-50"
                >
                  <FiMinus size={20} />
                </button>
                <span className="text-xl font-bold w-12 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
                >
                  <FiPlus size={20} />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <FiTrash2 size={24} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Order Summary
          </h2>
          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="block w-full bg-orange-600 text-white text-center py-4 rounded-full mt-8 font-semibold text-lg hover:bg-orange-700 transition"
          >
            Proceed to Checkout
          </Link>

          <button
            onClick={clearCart}
            className="w-full text-center text-red-600 mt-4 hover:text-red-800 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
