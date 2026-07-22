import { FaComments, FaLock, FaBolt, FaUsers, FaCloud, FaMobileAlt } from "react-icons/fa";

const features = [
  { icon: <FaComments />, title: "Real-Time Messaging", description: "Instant conversations powered by Socket.IO with seamless message delivery." },
  { icon: <FaLock />, title: "Secure Authentication", description: "JWT authentication and encrypted communication keep your account protected." },
  { icon: <FaBolt />, title: "Lightning Fast", description: "Optimized React frontend and Node.js backend for blazing-fast performance." },
  { icon: <FaUsers />, title: "Online Presence", description: "Know who's online instantly and enjoy a smooth real-time chat experience." },
  { icon: <FaCloud />, title: "Cloud Ready", description: "Designed to deploy on Vercel, Render, Railway or any cloud platform." },
  { icon: <FaMobileAlt />, title: "Responsive Design", description: "Works beautifully on desktop, tablet and mobile devices." },
];

const Features = () => {
  return (
    <section id="features" className="relative bg-navy-900 py-20 md:py-28 overflow-hidden">
      <div className="absolute top-20 left-0 w-52 md:w-72 h-52 md:h-72 bg-brand-600/20 blur-[100px] md:blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent-600/20 blur-[110px] md:blur-[140px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <span className="inline-block px-4 md:px-5 py-2 rounded-full bg-surface-800/50 border border-surface-700/30 text-brand-400 font-medium text-sm md:text-base">Powerful Features</span>
          <h2 className="mt-5 md:mt-6 text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
            Everything You Need<br />
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">To Build Conversations</span>
          </h2>
          <p className="mt-6 text-surface-400 text-base md:text-lg max-w-3xl mx-auto leading-8">
            ChatSphere combines modern technologies with a beautiful interface to deliver secure, fast and reliable real-time messaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index}
              className="group relative rounded-3xl border border-surface-700/30 bg-surface-800/30 backdrop-blur-xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-brand-500/50 hover:shadow-glow">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center text-white text-2xl md:text-3xl mb-6 group-hover:scale-110 transition">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-surface-400 leading-7 md:leading-8 text-sm md:text-base">{feature.description}</p>
              <div className="mt-6 md:mt-8 h-1 w-14 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
