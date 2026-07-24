import { FaReact, FaNodeJs, FaGithub } from "react-icons/fa";
import { SiMongodb, SiExpress, SiSocketdotio, SiTailwindcss, SiJsonwebtokens } from "react-icons/si";

const techs = [
  { icon: <FaReact />, name: "React", color: "text-cyan-400" },
  { icon: <FaNodeJs />, name: "Node.js", color: "text-green-500" },
  { icon: <SiExpress />, name: "Express", color: "text-gray-300" },
  { icon: <SiMongodb />, name: "MongoDB", color: "text-green-600" },
  { icon: <SiSocketdotio />, name: "Socket.IO", color: "text-white" },
  { icon: <SiJsonwebtokens />, name: "JWT", color: "text-orange-400" },
  { icon: <SiTailwindcss />, name: "Tailwind CSS", color: "text-sky-400" },
  { icon: <FaGithub />, name: "GitHub", color: "text-white" },
];

const TechStack = () => {
  return (
    <section id="tech" className="bg-navy-900 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">Built With Modern Technologies</h2>
          <p className="text-surface-400 mt-5 text-base md:text-lg max-w-2xl mx-auto">Production-ready tools powering ChatSphere.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {techs.map((tech, index) => (
            <div key={index}
              className="rounded-3xl bg-surface-800/30 border border-surface-700/30 p-6 md:p-10 flex flex-col items-center justify-center hover:border-brand-500/50 hover:-translate-y-2 transition duration-300">
              <div className={`${tech.color} text-5xl md:text-6xl`}>{tech.icon}</div>
              <h3 className="mt-5 text-white text-lg md:text-xl font-semibold text-center">{tech.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
