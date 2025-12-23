import { Link, useNavigate } from "react-router-dom";
import { SiTelegram, SiInstagram, SiLinkedin } from "react-icons/si";
import { useAuth } from "../context/AuthContext";
// import heroImage from "../assets/ethiopian-food-hero.png"; // Add an image in your assets
const heroImage =
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80";

const categories = [
  {
    name: "Burger",
    icon: "🍔",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pizza",
    icon: "🍕",
    img: "https://images.unsplash.com/photo-1601924582975-30f64a1f16f4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pasta",
    icon: "🍝",
    img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Drinks",
    icon: "🥤",
    img: "https://images.unsplash.com/photo-1599785209707-0b3f137f3e71?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Desserts",
    icon: "🍨",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleCategoryClick = (category) => {
    navigate(`/menu#${category}`);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative h-[600px] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>{" "}
        {/* Dark overlay */}
        <div className="relative text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Hungry? Order Ethiopian Delights!
          </h1>
          <p className="text-xl mb-8">
            Fresh, authentic meals delivered to your door in 30 mins
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-700 transition"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition transform cursor-pointer"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-40 object-cover"
              />
              <div className="text-center p-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {cat.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recently Ordered Items */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Recently Ordered Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* You can fetch last order items here in the future */}
            {/* For now, placeholder */}
            <p className="text-center text-xl text-gray-600 col-span-full">
              Your recent items will appear here after placing an order!
            </p>
          </div>
        </div>
      )}
      {/* About Section */}
      <div className="bg-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            About Admas Delivery
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Admas Delivery brings your favorite Ethiopian meals from local
            kitchens right to your door. Fresh, authentic, and delicious —
            experience the taste of Ethiopia anytime.
          </p>
          <p className="text-lg text-gray-600 mt-6">
            Quality food. Fast delivery. Happy customers.
          </p>
        </div>
      </div>

      {/* Feedback / Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg italic text-gray-700 mb-6">
              "Best food delivery app! The burgers are always hot and fresh.
              Highly recommend!"
            </p>
            <p className="font-bold text-orange-600">— Michael T.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg italic text-gray-700 mb-6">
              "Fast delivery and amazing pizza selection. My go-to app every
              weekend!"
            </p>
            <p className="font-bold text-orange-600">— Sarah K.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-lg italic text-gray-700 mb-6">
              "Love the variety and easy ordering. The desserts are to die for!"
            </p>
            <p className="font-bold text-orange-600">— David L.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Admas Delivery 🍔</h3>
              <p className="text-gray-400">
                Your favorite food, delivered fast.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-orange-400 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/menu" className="hover:text-orange-400 transition">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-orange-400 transition">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-orange-400 transition"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-orange-400 transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-orange-400 transition"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4 mt-4 text-2xl">
                <a
                  href="https://t.me/mamex7sl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400"
                >
                  <SiTelegram />
                </a>
                <a
                  href="https://www.instagram.com/mamex7sl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400"
                >
                  <SiInstagram />
                </a>
                <a
                  href="https://www.linkedin.com/in/Mohammed Shifa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400"
                >
                  <SiLinkedin />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Admas Delivery. All rights reserved. Built with ❤️ by
              Mohammed Shifa
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
