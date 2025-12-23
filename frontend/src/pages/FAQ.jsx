import { useState } from "react";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 30–45 minutes depending on your location and order size.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes! You can track your order in real-time from the app or website.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer refunds if your order is missing items or has major issues. Contact support within 24 hours.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept card payments, mobile money, and cash on delivery.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
        Frequently Asked Questions
      </h1>
      <p className="text-center text-gray-600 text-lg mb-12">
        Here are some of the most common questions our customers ask.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-xl text-gray-800">
                {faq.question}
              </h3>
              <span className="text-orange-600 font-bold text-2xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>
            {openIndex === index && (
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
