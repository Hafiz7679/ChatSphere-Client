import { Link } from "react-router-dom";
import { FaArrowRight, FaRocket } from "react-icons/fa";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 md:py-32">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[320px] sm:w-[450px] lg:w-[650px] h-[320px] sm:h-[450px] lg:h-[650px] rounded-full bg-brand-600/20 blur-[90px] md:blur-[130px] lg:blur-[160px]" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="rounded-[28px] md:rounded-[40px] border border-surface-700/30 bg-gradient-to-br from-surface-800/50 to-navy-900 p-8 md:p-16 lg:p-24 text-center shadow-glass">
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 rounded-full bg-white/5 border border-surface-700/30 text-brand-400 text-sm md:text-base mb-6 md:mb-8">
            <FaRocket /> <span>Ready To Get Started?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight">
            Start Chatting<br />With
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent"> ChatSphere</span>
          </h2>

          <p className="mt-6 md:mt-8 max-w-3xl mx-auto text-surface-400 text-base md:text-xl leading-8 md:leading-9">
            Experience secure authentication, real-time messaging, modern UI and lightning-fast performance built with React, Node.js, MongoDB and Socket.IO.
          </p>

          <div className="mt-10 md:mt-14 flex flex-col sm:flex-row justify-center gap-5">
            <Link to="/register"
              className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold flex justify-center items-center gap-3 hover:scale-105 transition duration-300 shadow-lg shadow-brand-600/30">
              Create Account <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-surface-700/30 text-white bg-surface-800/30 hover:border-brand-500/50 transition text-center">
              Login
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
            <div className="rounded-2xl bg-surface-800/20 border border-surface-700/30 p-6 hover:border-brand-500/50 transition">
              <h3 className="text-xl md:text-2xl font-bold text-white">Secure</h3>
              <p className="text-surface-400 mt-2 text-sm md:text-base">JWT Authentication</p>
            </div>
            <div className="rounded-2xl bg-surface-800/20 border border-surface-700/30 p-6 hover:border-brand-500/50 transition">
              <h3 className="text-xl md:text-2xl font-bold text-white">Fast</h3>
              <p className="text-surface-400 mt-2 text-sm md:text-base">Socket.IO Powered</p>
            </div>
            <div className="rounded-2xl bg-surface-800/20 border border-surface-700/30 p-6 hover:border-brand-500/50 transition">
              <h3 className="text-xl md:text-2xl font-bold text-white">Reliable</h3>
              <p className="text-surface-400 mt-2 text-sm md:text-base">MongoDB Database</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
