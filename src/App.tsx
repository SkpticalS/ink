import { useState, useCallback } from "react";
import LoginPage from "./sections/LoginPage";
import LobbyPage from "./sections/LobbyPage";
import ClassroomPage from "./sections/ClassroomPage";

export type AppPage = "login" | "lobby" | "classroom";
export type ClassroomPhase = "pre" | "in" | "post";

function App() {
  const [page, setPage] = useState<AppPage>("login");
  const [classroomPhase, setClassroomPhase] = useState<ClassroomPhase>("pre");
  const [completedPhases, setCompletedPhases] = useState<ClassroomPhase[]>([]);

  const goToLobby = useCallback(() => setPage("lobby"), []);
  const goToClassroom = useCallback(() => {
    setPage("classroom");
    setClassroomPhase("pre");
    setCompletedPhases([]);
  }, []);
  const backToLobby = useCallback(() => setPage("lobby"), []);

  const completePre = useCallback(() => {
    setCompletedPhases(["pre"]);
    setClassroomPhase("in");
  }, []);

  const completeIn = useCallback(() => {
    setCompletedPhases(["pre", "in"]);
    setClassroomPhase("post");
  }, []);

  const handlePhaseChange = useCallback((phase: ClassroomPhase) => {
    setClassroomPhase(phase);
  }, []);

  return (
    <div className="min-h-screen bg-xuan-white">
      {page === "login" && <LoginPage onLogin={goToLobby} />}
      {page === "lobby" && <LobbyPage onEnterClassroom={goToClassroom} />}
      {page === "classroom" && (
        <ClassroomPage
          phase={classroomPhase}
          completedPhases={completedPhases}
          onPhaseChange={handlePhaseChange}
          onCompletePre={completePre}
          onCompleteIn={completeIn}
          onBackToLobby={backToLobby}
        />
      )}
    </div>
  );
}

export default App;
