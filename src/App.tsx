import { useState, useCallback } from "react";
import LoginPage from "./sections/LoginPage";
import LobbyPage from "./sections/LobbyPage";
import ClassroomPage from "./sections/ClassroomPage";

type AppPage = "login" | "lobby" | "classroom";

function App() {
  const [page, setPage] = useState<AppPage>("login");

  const goToLobby = useCallback(() => setPage("lobby"), []);
  const goToClassroom = useCallback(() => setPage("classroom"), []);

  return (
    <div className="min-h-screen bg-xuan-white">
      {page === "login" && <LoginPage onLogin={goToLobby} />}
      {page === "lobby" && <LobbyPage onEnterClassroom={goToClassroom} />}
      {page === "classroom" && <ClassroomPage />}
    </div>
  );
}

export default App;
