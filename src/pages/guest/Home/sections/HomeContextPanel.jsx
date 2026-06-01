import { BellRing, Download, ShieldOff } from "lucide-react";
import { Button } from "../../../../components/atoms/Button/Button.jsx";
import { SettingsPanel } from "../../../../components/domain/home/SettingsPanel/SettingsPanel.jsx";
import { StatCard } from "../../../../components/domain/home/StatCard/StatCard.jsx";

export function HomeContextPanel({
  importInputRef,
  isSettingsOpen,
  notificationsAreEnabled,
  onClear,
  onCloseSettings,
  onDisableNotifications,
  onEnableNotifications,
  onExport,
  onImport,
  onPickImport,
  onStatsRangeChange,
  onThemeChange,
  preferences,
  stats,
  statsRange,
}) {
  return (
    <aside className="context-panel" aria-label="Yaad-Dehani summary">
      <div className="ink-note">
        <p className="eyebrow">یاد دہانی</p>
        <h2>Remember with kindness.</h2>
        <p>Yaad-Dehani keeps your plans in this browser. Export a copy when you want a backup.</p>
      </div>
      <div className="stats-grid">
        <div className="stats-grid__header">
          <h3>Stats</h3>
          <label htmlFor="stats-range-filter">
            <span className="sr-only">Stats range</span>
            <select
              id="stats-range-filter"
              value={statsRange}
              onChange={(event) => onStatsRangeChange(event.target.value)}
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="month">This month</option>
              <option value="year">This year</option>
            </select>
          </label>
        </div>
        <StatCard
          completed={stats.event.completed}
          high={stats.event.high}
          label="Events"
          pending={stats.event.pending}
          value={stats.event.count}
        />
        <StatCard
          completed={stats.task.completed}
          high={stats.task.high}
          label="Tasks"
          pending={stats.task.pending}
          value={stats.task.count}
        />
        <StatCard
          completed={stats.reminder.completed}
          high={stats.reminder.high}
          label="Reminders"
          pending={stats.reminder.pending}
          value={stats.reminder.count}
        />
        <StatCard
          completed={stats.total.completed}
          high={stats.total.high}
          label="Total"
          pending={stats.total.pending}
          value={stats.total.count}
        />
      </div>
      <div className="side-actions">
        <Button
          icon={notificationsAreEnabled ? ShieldOff : BellRing}
          onClick={notificationsAreEnabled ? onDisableNotifications : onEnableNotifications}
        >
          {notificationsAreEnabled ? "Disable notifications" : "Enable reminders"}
        </Button>
        <Button icon={Download} onClick={onExport}>
          Export data
        </Button>
      </div>
      {isSettingsOpen ? (
        <SettingsPanel
          inputRef={importInputRef}
          notificationsAreEnabled={notificationsAreEnabled}
          onClear={onClear}
          onClose={onCloseSettings}
          onDisableNotifications={onDisableNotifications}
          onEnableNotifications={onEnableNotifications}
          onExport={onExport}
          onImport={onImport}
          onPickImport={onPickImport}
          onThemeChange={onThemeChange}
          preferences={preferences}
        />
      ) : null}
    </aside>
  );
}
