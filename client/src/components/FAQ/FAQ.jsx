import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  { question: "Is ChatSphere completely free?", answer: "Yes. ChatSphere is an open-source project built for learning and portfolio purposes. You can customize and deploy it on your own server." },
  { question: "Which technologies are used?", answer: "React.js, Node.js, Express.js, MongoDB, Socket.IO, JWT Authentication and Tailwind CSS." },
  { question: "Does it support real-time messaging?", answer: "Yes. Messages are delivered instantly using Socket.IO with a persistent MongoDB database." },
  { question: "Can I deploy ChatSphere?", answer: "Yes. You can deploy the frontend on Vercel and the backend on Render, Railway or any Node.js hosting platform." },
  { question: "Is authentication secure?", answer: "Absolutely. ChatSphere uses JWT Authentication with encrypted passwords stored using bcrypt." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative bg-navy-900 py-20 md:py-28 overflow-hidden">
      <div className="absolute left-0 top-20 w-56 md:w-72 h-56 md:h-72 bg-brand-600/20 rounded-full blur-[100px] md:blur-[120px]" />
      <div className="absolute right-0 bottom-0 w-64 md:w-80 h-64 md:h-80 bg-accent-600/20 rounded-full blur-[120px] md:blur-[140px]" />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <span className="inline-block px-4 md:px-5 py-2 rounded-full bg-surface-800/50 border border-surface-700/30 text-brand-400 text-sm md:text-base">Frequently Asked Questions</span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Got Questions?</h2>
          <p className="mt-5 text-surface-400 text-base md:text-lg">Everything you need to know before using ChatSphere.</p>
        </div>

        <div className="space-y-4 md:space-y-5">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-3xl border border-surface-700/30 bg-surface-800/30 backdrop-blur-xl overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex justify-between items-center px-5 md:px-8 py-5 md:py-6 text-left">
                <span className="text-base md:text-xl font-semibold text-white pr-4">{faq.question}</span>
                <FaChevronDown className={`text-brand-400 transition duration-300 flex-shrink-0 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <div className={`transition-all duration-500 overflow-hidden ${openIndex === index ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="px-5 md:px-8 pb-6 md:pb-8 text-surface-400 leading-7 md:leading-8 text-sm md:text-base">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
