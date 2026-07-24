import { FaShieldAlt, FaBolt, FaComments, FaMobileAlt } from "react-icons/fa";

const features = [
  { icon: <FaComments />, title: "Real-Time Chat" },
  { icon: <FaShieldAlt />, title: "Secure Authentication" },
  { icon: <FaBolt />, title: "Lightning Fast" },
  { icon: <FaMobileAlt />, title: "Fully Responsive" },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative bg-navy-900 py-20 md:py-28 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-600/20 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-surface-800/50 border border-surface-700/30 text-brand-400 text-sm font-medium">About ChatSphere</span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              A Modern Messaging Platform<br />Built For Everyone
            </h2>
            <p className="mt-6 text-surface-400 leading-8 text-base md:text-lg">
              ChatSphere is a full-stack real-time messaging platform built with React, Node.js, MongoDB and Socket.IO. It delivers lightning-fast communication, secure authentication, and a modern user experience across desktop, tablet and mobile devices.
            </p>
            <div className="grid grid-cols-2 gap-5 mt-10">
              {features.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-3xl bg-surface-800/30 border border-surface-700/30 p-8 text-center">
              <h3 className="text-5xl font-bold text-brand-500">100%</h3>
              <p className="text-surface-400 mt-3">Responsive</p>
            </div>
            <div className="rounded-3xl bg-surface-800/30 border border-surface-700/30 p-8 text-center">
              <h3 className="text-5xl font-bold text-accent-500">⚡</h3>
              <p className="text-surface-400 mt-3">Real-Time</p>
            </div>
            <div className="rounded-3xl bg-surface-800/30 border border-surface-700/30 p-8 text-center">
              <h3 className="text-5xl font-bold text-green-500">🔒</h3>
              <p className="text-surface-400 mt-3">Secure</p>
            </div>
            <div className="rounded-3xl bg-surface-800/30 border border-surface-700/30 p-8 text-center">
              <h3 className="text-5xl font-bold text-cyan-500">🚀</h3>
              <p className="text-surface-400 mt-3">Fast</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
