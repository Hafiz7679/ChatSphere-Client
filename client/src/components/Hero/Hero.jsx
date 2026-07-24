import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaGithub, FaCheckCircle } from "react-icons/fa";
import heroPreview from "../../assets/hero-preview.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-navy-900 pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="absolute -top-24 right-0 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-brand-700/20 blur-[120px] md:blur-[180px]" />
      <div className="absolute bottom-0 left-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-accent-700/20 blur-[100px] md:blur-[150px]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-surface-800/50 border border-surface-700/30 text-surface-400 mb-6 md:mb-8 text-sm md:text-base">
              <FaCheckCircle className="text-brand-500" />
              <span>Modern • Secure • Real-Time</span>
            </div>

            <h1 className="text-white font-black leading-tight text-4xl sm:text-5xl lg:text-7xl">
              Connect.<br />Chat.<br />
              <span className="bg-gradient-to-r from-brand-500 via-accent-500 to-cyan-400 bg-clip-text text-transparent">Collaborate.</span>
            </h1>

            <p className="mt-6 md:mt-8 text-surface-400 text-base sm:text-lg lg:text-xl leading-8 max-w-xl mx-auto lg:mx-0">
              ChatSphere is a modern real-time messaging platform powered by React, Node.js, MongoDB and Socket.IO. Built for developers, teams and anyone who values fast, secure communication.
            </p>

            <div className="relative z-40 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
              <button onClick={() => navigate("/register")}
                className="group w-full sm:w-auto cursor-pointer px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold flex items-center justify-center gap-3 hover:scale-105 transition duration-300 shadow-xl shadow-brand-600/30">
                Get Started <FaArrowRight className="group-hover:translate-x-1 transition" />
              </button>
              <button onClick={() => window.open("https://github.com/Hafiz7679", "_blank")}
                className="w-full sm:w-auto cursor-pointer px-8 py-4 rounded-2xl border border-surface-700/30 bg-surface-800/50 text-white flex items-center justify-center gap-3 hover:border-brand-500/50 transition">
                <FaGithub /> GitHub
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-14 text-center lg:text-left">
              <div><h2 className="text-3xl md:text-4xl font-bold text-white">React</h2><p className="text-surface-500 mt-2">Frontend</p></div>
              <div><h2 className="text-3xl md:text-4xl font-bold text-white">Socket.IO</h2><p className="text-surface-500 mt-2">Real-Time</p></div>
              <div><h2 className="text-3xl md:text-4xl font-bold text-white">MongoDB</h2><p className="text-surface-500 mt-2">Database</p></div>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="absolute inset-0 rounded-[40px] bg-brand-600 blur-[70px] md:blur-[90px] opacity-30" />
            <div className="relative rounded-[24px] md:rounded-[28px] overflow-hidden border border-brand-500/20 bg-surface-800/30 shadow-glass">
              <div className="h-12 md:h-14 bg-surface-800/50 flex items-center px-4 md:px-5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 md:px-5 py-1 rounded-full bg-surface-700/50 text-surface-400 text-xs md:text-sm">chatsphere.app</div>
                </div>
              </div>
              <img src={heroPreview} alt="Chat Preview" className="w-full object-cover" />
            </div>

            <div className="relative lg:absolute lg:-bottom-8 lg:-left-8 mt-6 lg:mt-0 bg-surface-800/40 border border-surface-700/30 rounded-2xl p-4 md:p-5 shadow-glass max-w-xs">
              <h3 className="text-white font-semibold text-base md:text-lg">Real-Time Messaging</h3>
              <p className="text-surface-400 mt-2 text-sm">Powered by Socket.IO</p>
            </div>

            <div className="hidden md:block absolute -top-8 -right-8 bg-surface-800/40 border border-surface-700/30 rounded-2xl p-5 shadow-glass">
              <h3 className="text-white font-semibold">JWT Authentication</h3>
              <p className="text-surface-400 mt-2 text-sm">Secure Login System</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
