import { useEffect, useRef } from "react";
import type { ClassroomPhase } from "../App";
import Navigation from "./Navigation";
import PreClassSection from "./PreClassSection";
import InClassSection from "./InClassSection";
import PostClassSection from "./PostClassSection";
import FooterSection from "./FooterSection";

interface ClassroomPageProps {
  phase: ClassroomPhase;
  completedPhases: ClassroomPhase[];
  onPhaseChange: (phase: ClassroomPhase) => void;
  onCompletePre: () => void;
  onCompleteIn: () => void;
  onBackToLobby: () => void;
}

export default function ClassroomPage({
  phase,
  completedPhases,
  onPhaseChange,
  onCompletePre,
  onCompleteIn,
  onBackToLobby,
}: ClassroomPageProps) {
  const mainRef = useRef<HTMLDivElement>(null);

  // Auto scroll to top when phase changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  return (
    <div ref={mainRef} className="min-h-screen bg-xuan-white overflow-x-hidden">
      <Navigation
        currentPhase={phase}
        completedPhases={completedPhases}
        onPhaseChange={onPhaseChange}
        onBackToLobby={onBackToLobby}
      />

      <main className="pt-[72px]">
        {phase === "pre" && <PreClassSection onComplete={onCompletePre} />}
        {phase === "in" && <InClassSection onComplete={onCompleteIn} />}
        {phase === "post" && <PostClassSection />}
      </main>

      {phase === "post" && <FooterSection />}
    </div>
  );
}
