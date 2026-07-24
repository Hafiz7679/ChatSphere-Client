import { FaComments, FaUsers, FaBolt, FaShieldAlt } from "react-icons/fa";

const stats = [
  { icon: <FaComments />, value: "Real-Time", title: "Messaging", description: "Instant communication powered by Socket.IO." },
  { icon: <FaUsers />, value: "Multi User", title: "Conversations", description: "Chat with multiple users seamlessly." },
  { icon: <FaBolt />, value: "<100ms", title: "Fast Response", description: "Optimized backend for lightning-fast performance." },
  { icon: <FaShieldAlt />, value: "100%", title: "Secure Login", description: "JWT authentication keeps your account protected." },
];

const Stats = () => {
  return (
    <section className="relative py-28 bg-navy-950 overflow-hidden">
      <div className="absolute top-0 left-20 w-80 h-80 rounded-full bg-brand-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-20 w-80 h-80 rounded-full bg-accent-600/20 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="px-5 py-2 rounded-full bg-surface-800/50 border border-surface-700/30 text-brand-400 font-medium">Why Choose ChatSphere</span>
          <h2 className="mt-6 text-5xl lg:text-6xl font-bold text-white">
            Built For
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent"> Speed</span>
            {" "}and
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent"> Security</span>
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-surface-400 text-lg leading-8">
            ChatSphere combines modern technologies, scalable architecture and beautiful UI to deliver a premium chatting experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {stats.map((item, index) => (
            <div key={index}
              className="group relative overflow-hidden rounded-3xl border border-surface-700/30 bg-surface-800/30 backdrop-blur-xl p-8 hover:border-brand-500/50 transition duration-300 hover:-translate-y-3 hover:shadow-glow">
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-brand-600/10 group-hover:bg-brand-600/20 transition" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center text-white text-3xl mb-8">
                {item.icon}
              </div>
              <h2 className="text-4xl font-black text-white">{item.value}</h2>
              <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-surface-400 leading-8">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
