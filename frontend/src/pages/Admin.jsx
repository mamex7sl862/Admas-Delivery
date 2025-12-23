import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("menu");
  const [editingId, setEditingId] = useState(null);
  // Inside Admin component, after fetching orders
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  // Form state with file and preview
  const [form, setForm] = useState({
    category: "",
    name: "",
    desc: "",
    price: "",
    img: "",
    imageFile: null,
    previewUrl: null,
  });

  useEffect(() => {
    if (!user?.isAdmin) navigate("/");
    fetchMenu();
    fetchOrders();
  }, [user]);

  const fetchMenu = async () => {
    const res = await axios.get("/api/menu");
    setMenuItems(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get("/api/orders");
    setOrders(res.data);
  };

  const handleEdit = (item) => {
    setForm({
      category: item.category,
      name: item.name,
      desc: item.desc,
      price: item.price,
      img: item.img,
      imageFile: null,
      previewUrl: null,
    });
    setEditingId(item._id);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      // Update local state
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("name", form.name);
    formData.append("desc", form.desc);
    formData.append("price", form.price);

    if (form.imageFile) formData.append("image", form.imageFile);
    else if (form.img) formData.append("img", form.img);

    try {
      if (editingId) {
        await axios.put(`/api/menu/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        category: "",
        name: "",
        desc: "",
        price: "",
        img: "",
        imageFile: null,
        previewUrl: null,
      });
      setEditingId(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Failed to save item");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this item?")) {
      await axios.delete(`/api/menu/${id}`);
      fetchMenu();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab("menu")}
            className={`px-6 py-3 rounded-lg ${
              tab === "menu" ? "bg-orange-600 text-white" : "bg-white"
            }`}
          >
            Menu Management
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-6 py-3 rounded-lg ${
              tab === "orders" ? "bg-orange-600 text-white" : "bg-white"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab("analysis")}
            className={`px-6 py-3 rounded-lg ${
              tab === "analysis" ? "bg-orange-600 text-white" : "bg-white"
            }`}
          >
            Analysis
          </button>
        </div>

        {/* MENU MANAGEMENT TAB */}
        {tab === "menu" && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? "Edit" : "Add New"} Item
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-6"
              >
                <input
                  placeholder="Category (e.g., Burger)"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                  className="px-4 py-3 border rounded-xl"
                />
                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="px-4 py-3 border rounded-xl"
                />
                <textarea
                  placeholder="Description"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  required
                  rows="3"
                  className="px-4 py-3 border rounded-xl md:col-span-2"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  className="px-4 py-3 border rounded-xl"
                />

                {/* FILE UPLOAD + PREVIEW */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Food Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setForm({ ...form, imageFile: file });

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setForm((prev) => ({
                            ...prev,
                            previewUrl: event.target.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />

                  {form.previewUrl && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-2">
                        New Image Preview:
                      </p>
                      <img
                        src={form.previewUrl}
                        alt="Preview"
                        className="w-full max-w-lg h-80 object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  )}

                  {!form.previewUrl && form.img && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-2">
                        Current Image:
                      </p>
                      <img
                        src={form.img}
                        alt="Current"
                        className="w-full max-w-lg h-80 object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg md:col-span-2 transition"
                >
                  {editingId ? "Update Item" : "Add Item"}
                </button>
              </form>
            </div>

            {/* Menu Items Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-3">{item.desc}</p>
                    <p className="text-3xl font-bold text-orange-600 mb-2">
                      ${item.price}
                    </p>
                    {item.averageRating > 0 && (
                      <p className="text-gray-700 mb-2">
                        Average Rating: {item.averageRating.toFixed(1)} ⭐ (
                        {item.reviews.length} reviews)
                      </p>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                      >
                        <FiEdit size={20} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition"
                      >
                        <FiTrash2 size={20} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Items</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{order._id.slice(-8)}</td>
                    <td className="px-6 py-4">{order.items.length} items</td>
                    <td className="px-6 py-4 font-semibold">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="On the way">On the way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center py-12 text-gray-500">No orders yet</p>
            )}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-green-600 mb-8">
                Total Revenue: ${totalRevenue.toFixed(2)}
              </h3>
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {tab === "analysis" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Food Analysis</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Food</th>
                  <th className="px-4 py-2 border">Average Rating</th>
                  <th className="px-4 py-2 border">Reviews Count</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border">
                      {item.averageRating.toFixed(1)} ⭐
                    </td>
                    <td className="px-4 py-2 border">{item.reviews.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
