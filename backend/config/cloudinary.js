const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dnuyrpvsx", // paste from dashboard
  api_key: "496892833163396", // paste
  api_secret: "6Itzfe_q3tDTh7viIqfT3OeP-NA", // paste
});

module.exports = cloudinary;
