import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import Stats from "../components/Stats/Stats";
import TechStack from "../components/TechStack/TechStack";
import FAQ from "../components/FAQ/FAQ";
import CTA from "../components/CTA/CTA";
import Footer from "../components/Footer/Footer";
import AboutSection from "../components/AboutSection/AboutSection";

const Home = () => {
  return (
    <div className="bg-[#0B1020] text-white overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />

        <Features />

        <Stats />

        <TechStack />
        
        <AboutSection />

        <FAQ />

        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default Home;