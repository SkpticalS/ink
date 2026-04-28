import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import GallerySection from "./GallerySection";
import PreClassSection from "./PreClassSection";
import InClassSection from "./InClassSection";
import PostClassSection from "./PostClassSection";
import FooterSection from "./FooterSection";

gsap.registerPlugin(ScrollTrigger);

export default function ClassroomPage() {
  const [activeTab, setActiveTab] = useState("pre");
  const [showHero, setShowHero] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setShowHero(false);
    setTimeout(() => {
      const el = document.getElementById(`section-${tabId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const handleStart = useCallback(() => {
    setShowHero(false);
    setTimeout(() => {
      const el = document.getElementById("section-pre");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    const sections = ["pre", "in", "post"];
    const handleScroll = () => {
      if (showHero && window.scrollY < window.innerHeight * 0.3) return;
      for (const id of sections) {
        const el = document.getElementById(`section-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom > 250) {
            setActiveTab(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showHero]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((el) => {
        gsap.fromTo(el, { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }
        );
      });
    }, mainRef);
    return () => ctx.revert();
  }, [showHero]);

  return (
    <div ref={mainRef} className="min-h-screen bg-xuan-white overflow-x-hidden">
      <Navigation activeTab={activeTab} onTabChange={scrollToSection} />

      {showHero && <HeroSection onStart={handleStart} />}

      <main className={showHero ? "" : "pt-[72px]"}>
        <GallerySection />
        <SectionDivider />
        <div id="section-pre"><PreClassSection /></div>
        <SectionDivider type="cinnabar" />
        <div id="section-in"><InClassSection /></div>
        <SectionDivider type="gold" />
        <div id="section-post"><PostClassSection /></div>
      </main>

      <FooterSection />
    </div>
  );
}

function SectionDivider({ type = "gold" }: { type?: "gold" | "cinnabar" }) {
  const color = type === "cinnabar" ? "bg-cinnabar/40" : "bg-gold-600/40";
  return (
    <div className="py-12 flex items-center justify-center gap-6">
      <div className="w-24 h-px bg-gradient-to-r from-transparent to-ink-300/20" />
      <div className={`w-3 h-3 rounded-full ${color} animate-breathe`} />
      <div className="w-2 h-2 rounded-full bg-ink-300/20" />
      <div className={`w-3 h-3 rounded-full ${color} animate-breathe`} style={{ animationDelay: "1s" }} />
      <div className="w-24 h-px bg-gradient-to-l from-transparent to-ink-300/20" />
    </div>
  );
}
