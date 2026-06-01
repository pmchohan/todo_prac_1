import {
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { Button } from "../../atoms/Button/Button.jsx";
import brandIcon from "../../../assets/yaad-dehani-clipboard.svg";
import "./PrimaryNavigation.css";

export function PrimaryNavigation({
  activeView,
  isCollapsed,
  onChangeView,
  onOpenSettings,
  onToggleSidebar,
  onToggleTheme,
  theme,
  views,
}) {
  return (
    <>
      <aside className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`} aria-label="Primary">
        <div className="sidebar__top">
          <Brand isCollapsed={isCollapsed} />
          {!isCollapsed ? (
            <SidebarToggle isCollapsed={isCollapsed} onToggleSidebar={onToggleSidebar} />
          ) : null}
        </div>
        <nav className="sidebar__nav">
          {views.map((view) => (
            <button
              aria-current={activeView === view.id ? "page" : undefined}
              className="nav-item"
              key={view.id}
              onClick={() => onChangeView(view.id)}
              type="button"
              title={isCollapsed ? view.label : undefined}
            >
              <view.icon aria-hidden="true" size={20} />
              <span>{view.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar__actions">
          {isCollapsed ? (
            <SidebarToggle isCollapsed={isCollapsed} onToggleSidebar={onToggleSidebar} />
          ) : null}
          <Button icon={theme === "dark" ? Sun : Moon} onClick={onToggleTheme}>
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          <Button icon={Settings} onClick={onOpenSettings}>
            Settings
          </Button>
        </div>
      </aside>
      <header className="mobile-header">
        <Brand />
        <Button icon={Settings} onClick={onOpenSettings}>
          Settings
        </Button>
      </header>
      <nav className="bottom-nav" aria-label="Mobile primary">
        {views.slice(0, 5).map((view) => (
          <button
            aria-current={activeView === view.id ? "page" : undefined}
            className="bottom-nav__item"
            key={view.id}
            onClick={() => onChangeView(view.id)}
            type="button"
          >
            <view.icon aria-hidden="true" size={20} />
            <span>{view.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

function SidebarToggle({ isCollapsed, onToggleSidebar }) {
  return (
    <button
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="icon-button sidebar__toggle"
      onClick={onToggleSidebar}
      title={isCollapsed ? "Expand sidebar" : undefined}
      type="button"
    >
      {isCollapsed ? (
        <PanelLeftOpen aria-hidden="true" size={18} />
      ) : (
        <PanelLeftClose aria-hidden="true" size={18} />
      )}
    </button>
  );
}

function Brand({ isCollapsed = false }) {
  return (
    <div className="brand" aria-label="Yaad-Dehani">
      <div className="brand__seal" aria-hidden="true">
        <img alt="" height="48" src={brandIcon} width="48" />
      </div>
      {!isCollapsed ? (
        <div>
          <p>Yaad-Dehani</p>
          <span>یاد دہانی</span>
        </div>
      ) : null}
    </div>
  );
}
