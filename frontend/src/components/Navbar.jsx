import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import useCartStore from "../store/cartStore";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-orange-600">
            Admas Delivery 🍔
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/menu"
              className="text-gray-700 hover:text-orange-600 transition"
            >
              Menu
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search dishes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:border-orange-500"
              />
              <FiSearch
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative">
              <FiShoppingCart
                size={28}
                className="text-gray-700 hover:text-orange-600 transition"
              />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <FiUser size={28} className="text-gray-700" />

                {/* My Orders link */}
                <Link
                  to="/my-orders"
                  className="text-gray-700 hover:text-orange-600 font-medium transition"
                >
                  My Orders
                </Link>

                {/* Admin Panel */}
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-orange-600 font-medium transition"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition flex items-center gap-2"
                >
                  <FiLogOut size={24} />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <FiUser
                  size={28}
                  className="text-gray-700 hover:text-orange-600 transition"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
