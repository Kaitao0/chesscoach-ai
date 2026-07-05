import {
  BarChart3,
  BookOpen,
  Brain,
  GraduationCap,
  LayoutDashboard,
  Moon,
  Puzzle,
  Swords,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DashboardPage } from "./pages/DashboardPage";
import { LearnPage } from "./pages/LearnPage";
import { OpeningsPage } from "./pages/OpeningsPage";
import { PlayPage } from "./pages/PlayPage";
import { ProfilePage } from "./pages/ProfilePage";
import { PuzzlesPage } from "./pages/PuzzlesPage";
import { ReviewPage } from "./pages/ReviewPage";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/play", label: "Gioca", icon: Swords },
  { path: "/review/latest", label: "Review", icon: BarChart3 },
  { path: "/puzzles", label: "Puzzle", icon: Puzzle },
  { path: "/openings", label: "Aperture", icon: BookOpen },
  { path: "/learn", label: "Impara", icon: GraduationCap },
  { path: "/profile", label: "Profilo", icon: User },
];

export type Navigate = (path: string) => void;

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const navigate = (nextPath: string) => {
    window.history.pushState(null, "", nextPath);
    setPath(nextPath);
  };

  const page = useMemo(() => {
    if (path === "/play") return <PlayPage navigate={navigate} />;
    if (path.startsWith("/review")) return <ReviewPage gameId={path.split("/")[2] ?? "latest"} navigate={navigate} />;
    if (path === "/puzzles") return <PuzzlesPage />;
    if (path === "/openings") return <OpeningsPage />;
    if (path === "/learn") return <LearnPage />;
    if (path === "/profile") return <ProfilePage />;
    return <DashboardPage navigate={navigate} />;
  }, [path]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">♘</div>
          <div>
            <h1>ChessCoach AI</h1>
            <span>Training scacchistico</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Navigazione principale">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.path === "/" ? path === "/" : path.startsWith(item.path.replace("/latest", ""));
            return (
              <button key={item.path} className={`nav-item ${active ? "active" : ""}`} onClick={() => navigate(item.path)}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="notice">
            <strong className="row">
              <Brain size={16} /> Consiglio
            </strong>
            Controlla sempre scacchi, catture e minacce prima di scegliere una mossa.
          </div>
          <button className="ghost-button" onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Tema chiaro" : "Tema scuro"}
          </button>
        </div>
      </aside>
      <main className="content">{page}</main>
    </div>
  );
}
