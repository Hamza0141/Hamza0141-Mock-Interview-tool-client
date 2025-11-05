import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Menu } from "lucide-react";

export default function Navbar({ collapsed, onToggleSidebar }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 shadow-sm z-50 transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-bg-panel)",
        color: "var(--color-text-main)",
      }}
    >
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-[var(--color-primary)] text-lg tracking-wide">
          MockPrep
        </h1>
        <button
          onClick={onToggleSidebar}
          className="hover:text-[var(--color-primary)]"
        >
          <Menu size={22} />
        </button>
      </div>

      <div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md transition"
          style={{
            backgroundColor: "var(--color-bg-body)",
            color: "var(--color-text-main)",
          }}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
