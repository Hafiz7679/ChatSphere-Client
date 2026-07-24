import { Atom, FileCode, Code2, Database, Server, Radio, Palette, KeyRound } from "lucide-react";

const techs = [
  { icon: <Atom />, name: "React" },
  { icon: <FileCode />, name: "Node.js" },
  { icon: <Server />, name: "Express" },
  { icon: <Database />, name: "MongoDB" },
  { icon: <Radio />, name: "Socket.IO" },
  { icon: <KeyRound />, name: "JWT" },
  { icon: <Palette />, name: "Tailwind CSS" },
  { icon: <Code2 />, name: "GitHub" },
];

const TechStack = () => {
  return (
    <section id="tech" className="bg-navy-900 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">Built With Modern Technologies</h2>
          <p className="text-surface-400 mt-5 text-base md:text-lg max-w-2xl mx-auto">Production-ready tools powering ChatSphere.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {techs.map((tech, index) => (
            <div key={index}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-surface-800/30 border border-surface-700/30 hover:border-brand-500/50 hover:-translate-y-0.5 transition duration-300">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-600 to-accent-600 flex items-center justify-center text-white">
                {tech.icon}
              </div>
              <span className="text-sm font-medium text-white">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
