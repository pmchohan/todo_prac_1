import { PrimaryNavigation } from "../../components/navigation/PrimaryNavigation/PrimaryNavigation.jsx";
import "./SiteLayout.css";

export function SiteLayout({
  activeView,
  children,
  isSidebarCollapsed,
  onChangeView,
  onOpenSettings,
  onToggleSidebar,
  onToggleTheme,
  theme,
  views,
}) {
  return (
    <div className={`app-shell ${isSidebarCollapsed ? "app-shell--sidebar-collapsed" : ""}`}>
      <PrimaryNavigation
        activeView={activeView}
        isCollapsed={isSidebarCollapsed}
        onChangeView={onChangeView}
        onOpenSettings={onOpenSettings}
        onToggleSidebar={onToggleSidebar}
        onToggleTheme={onToggleTheme}
        theme={theme}
        views={views}
      />
      <main className="app-main" id="main-content" tabIndex="-1">
        {children}
      </main>
    </div>
  );
}
