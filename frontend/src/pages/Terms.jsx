const Terms = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
        Terms and Conditions
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        By using Admas Delivery, you agree to the following terms and
        conditions. Please read them carefully.
      </p>

      <ol className="list-decimal list-inside space-y-4 text-gray-700">
        <li>
          <strong>Eligibility:</strong> You must be at least 18 years old to
          place an order.
        </li>
        <li>
          <strong>Orders & Payment:</strong> All orders are subject to
          confirmation. Payment must be made using the provided methods.
        </li>
        <li>
          <strong>Delivery:</strong> Delivery times are estimated and may vary
          based on location and circumstances.
        </li>
        <li>
          <strong>Refunds & Cancellations:</strong> Refunds are provided only
          for missing items or errors in the order.
        </li>
        <li>
          <strong>Privacy:</strong> Your personal data will be used in
          accordance with our privacy policy.
        </li>
        <li>
          <strong>Changes to Terms:</strong> We reserve the right to update
          these terms at any time.
        </li>
      </ol>

      <p className="text-gray-600 mt-12 text-center">
        Thank you for choosing Admas Delivery! 🍔
      </p>
    </div>
  );
};

export default Terms;
