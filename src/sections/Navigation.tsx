import { useState, useEffect } from "react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "pre", label: "课前准备", icon: "备" },
  { id: "in", label: "课中互动", icon: "论" },
  { id: "post", label: "课后归档", icon: "档" },
];

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-4 md:px-10 transition-all duration-500 ${
        scrolled
          ? "bg-xuan-white/90 backdrop-blur-xl shadow-scroll"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-11 h-11 relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <img src="/images/seal-logo.png" alt="墨课" className="w-full h-full object-contain" />
        </div>
        <div>
          <span className="text-2xl font-bold text-ink-900 tracking-[0.15em]">墨课</span>
          <span className="hidden md:inline text-xs text-ink-400 ml-2 tracking-widest">ART AI</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-5 md:px-7 py-3 text-sm md:text-base font-medium transition-all duration-400 rounded-btn group ${
              activeTab === tab.id ? "text-ink-900" : "text-ink-400 hover:text-ink-700"
            }`}
          >
            {/* Small seal icon */}
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-sm text-xs mr-1.5 transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-cinnabar/10 text-cinnabar border border-cinnabar/30"
                : "bg-transparent text-ink-300 border border-transparent group-hover:border-ink-300/30"
            }`}>
              {tab.icon}
            </span>
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-[3px] bg-gold-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-xuan-aged border-2 border-gold-600/20 flex items-center justify-center text-xs text-ink-500 font-bold transition-all group-hover:border-gold-600/50 group-hover:bg-gold-100">
            用
          </div>
          <span className="text-sm text-ink-600 hidden md:block group-hover:text-gold-600 transition-colors">用户</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-btn hover:bg-xuan-aged transition-all duration-300 group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400 group-hover:text-gold-600 transition-colors group-hover:rotate-45 duration-300">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
