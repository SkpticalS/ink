import { useState, useEffect } from "react";
import type { ClassroomPhase } from "../App";

interface NavigationProps {
  currentPhase: ClassroomPhase;
  completedPhases: ClassroomPhase[];
  onPhaseChange: (phase: ClassroomPhase) => void;
  onBackToLobby: () => void;
}

const phases: { id: ClassroomPhase; label: string; icon: string }[] = [
  { id: "pre", label: "课前准备", icon: "备" },
  { id: "in", label: "课中互动", icon: "论" },
  { id: "post", label: "课后归档", icon: "档" },
];

export default function Navigation({
  currentPhase,
  completedPhases,
  onPhaseChange,
  onBackToLobby,
}: NavigationProps) {
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
          : "bg-xuan-white/60 backdrop-blur-sm"
      }`}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 group cursor-pointer"
        onClick={onBackToLobby}
      >
        <div className="w-11 h-11 relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <img
            src="/images/seal-logo.png"
            alt="墨课"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <span className="text-2xl font-bold text-ink-900 tracking-[0.15em]">
            墨课
          </span>
          <span className="hidden md:inline text-xs text-ink-400 ml-2 tracking-widest">
            ART AI
          </span>
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="flex items-center">
        {phases.map((phase, index) => {
          const isCompleted = completedPhases.includes(phase.id);
          const isCurrent = currentPhase === phase.id;
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div key={phase.id} className="flex items-center">
              <button
                onClick={() => !isLocked && onPhaseChange(phase.id)}
                disabled={isLocked}
                className={`relative px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-all duration-400 rounded-btn group ${
                  isCurrent
                    ? "text-ink-900"
                    : isCompleted
                    ? "text-stone-green hover:text-stone-green/80"
                    : "text-ink-300 cursor-not-allowed"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-sm text-xs mr-1.5 transition-all duration-300 ${
                    isCurrent
                      ? "bg-cinnabar/10 text-cinnabar border border-cinnabar/30"
                      : isCompleted
                      ? "bg-stone-green/10 text-stone-green border border-stone-green/30"
                      : "bg-transparent text-ink-300 border border-ink-300/20"
                  }`}
                >
                  {isCompleted ? "✓" : phase.icon}
                </span>
                {phase.label}
                {isCurrent && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-[3px] bg-gold-600 rounded-full" />
                )}
              </button>
              {index < phases.length - 1 && (
                <div
                  className={`w-6 h-px mx-1 ${
                    isCompleted ? "bg-stone-green/40" : "bg-ink-300/20"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToLobby}
          className="text-sm text-ink-500 hover:text-gold-600 transition-colors px-3 py-2 rounded-btn hover:bg-xuan-aged"
        >
          返回大厅
        </button>
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-xuan-aged border-2 border-gold-600/20 flex items-center justify-center text-xs text-ink-500 font-bold transition-all group-hover:border-gold-600/50 group-hover:bg-gold-100">
            用
          </div>
        </div>
      </div>
    </nav>
  );
}
