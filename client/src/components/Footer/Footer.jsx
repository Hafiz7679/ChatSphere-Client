import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";

const Footer = () => {
  return (
    <footer id="contact" className="bg-navy-950 border-t border-surface-700/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
                <FiMessageCircle className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-white">ChatSphere</h2>
            </div>
            <p className="text-surface-400 leading-8 text-sm md:text-base">
              A modern real-time messaging platform built with React, Node.js, MongoDB and Socket.IO.
            </p>
          </div>

          <div>
            <h3 className="text-white text-xl font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-4 text-surface-400">
              <li><a href="#features" className="hover:text-brand-400 transition">Features</a></li>
              <li><a href="#about" className="hover:text-brand-400 transition">About</a></li>
              <li><a href="#tech" className="hover:text-brand-400 transition">Tech Stack</a></li>
              <li><a href="#faq" className="hover:text-brand-400 transition">FAQ</a></li>
              <li><a href="/login" className="hover:text-brand-400 transition">Login</a></li>
              <li><a href="/register" className="hover:text-brand-400 transition">Register</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xl font-semibold mb-5">Technologies</h3>
            <ul className="space-y-4 text-surface-400">
              <li className="hover:text-white transition">React.js</li>
              <li className="hover:text-white transition">Node.js</li>
              <li className="hover:text-white transition">MongoDB</li>
              <li className="hover:text-white transition">Socket.IO</li>
              <li className="hover:text-white transition">JWT Authentication</li>
              <li className="hover:text-white transition">Tailwind CSS</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xl font-semibold mb-5">Connect</h3>
            <p className="text-surface-400 text-sm leading-7 mb-6">Connect with me or explore the ChatSphere project.</p>
            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/Hafiz7679" target="_blank" rel="noreferrer"
                className="w-12 h-12 rounded-xl bg-surface-800/30 border border-surface-700/30 flex items-center justify-center text-surface-400 hover:text-white hover:border-brand-500/50 transition">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"
                className="w-12 h-12 rounded-xl bg-surface-800/30 border border-surface-700/30 flex items-center justify-center text-surface-400 hover:text-blue-500 hover:border-blue-500/50 transition">
                <FaLinkedin />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"
                className="w-12 h-12 rounded-xl bg-surface-800/30 border border-surface-700/30 flex items-center justify-center text-surface-400 hover:text-pink-500 hover:border-pink-500/50 transition">
                <FaInstagram />
              </a>
              <a href="mailto:your@email.com"
                className="w-12 h-12 rounded-xl bg-surface-800/30 border border-surface-700/30 flex items-center justify-center text-surface-400 hover:text-red-500 hover:border-red-500/50 transition">
                <FaEnvelope />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-surface-700/20 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-surface-500 text-center md:text-left text-sm">© 2026 ChatSphere. All Rights Reserved.</p>
          <p className="text-surface-500 text-center md:text-right text-sm">Built with ❤️ by <a href="https://github.com/Hafiz7679" target="_blank" rel="noreferrer" className="text-surface-400 hover:text-white transition">Hafiz</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
