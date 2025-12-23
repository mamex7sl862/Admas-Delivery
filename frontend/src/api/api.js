import axios from "axios";

const api = axios.create({
  baseURL: "https://admas-delivery.onrender.com", // <- Replace with your Render URL
});

export default api;
