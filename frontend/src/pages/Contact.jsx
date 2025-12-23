const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
        Contact Us
      </h1>
      <p className="text-center text-gray-600 text-lg mb-12">
        We’d love to hear from you! Reach out to us with any questions or
        feedback.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📞</span>
            <div>
              <h3 className="font-bold text-xl text-gray-800">Phone</h3>
              <p className="text-gray-600">+251 900 000 000</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-3xl">✉️</span>
            <div>
              <h3 className="font-bold text-xl text-gray-800">Email</h3>
              <p className="text-gray-600">support@admasdelivery.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-3xl">📍</span>
            <div>
              <h3 className="font-bold text-xl text-gray-800">Address</h3>
              <p className="text-gray-600">Addis Ababa, Ethiopia</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-orange-700 transition w-full"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
