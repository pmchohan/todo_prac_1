import { Download, Eraser, FileUp, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "../../../atoms/Button/Button.jsx";

export function SettingsPanel({
  inputRef,
  notificationsAreEnabled,
  onClear,
  onClose,
  onDisableNotifications,
  onEnableNotifications,
  onExport,
  onImport,
  onPickImport,
  onThemeChange,
  preferences,
}) {
  return (
    <div className="modal-shell" role="presentation">
      <button aria-label="Close settings" className="modal-scrim" onClick={onClose} type="button" />
      <section aria-labelledby="settings-title" aria-modal="true" className="settings-panel" role="dialog">
        <header>
          <div>
            <p className="eyebrow">Local settings</p>
            <h2 id="settings-title">Keep your memory safe</h2>
          </div>
          <Button onClick={onClose}>Done</Button>
        </header>
        <div className="settings-panel__group">
          <h3>Theme</h3>
          <div className="segmented-control" role="group" aria-label="Theme">
            {["light", "dark"].map((theme) => (
              <button
                aria-pressed={preferences?.theme === theme}
                key={theme}
                onClick={() => onThemeChange(theme)}
                type="button"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-panel__group">
          <h3>Browser reminders</h3>
          <p>
            Yaad-Dehani can ask this browser to show reminder notifications. Reminders are most
            reliable while the app is open.
          </p>
          <Button
            icon={notificationsAreEnabled ? ShieldOff : ShieldCheck}
            onClick={notificationsAreEnabled ? onDisableNotifications : onEnableNotifications}
          >
            {notificationsAreEnabled ? "Disable notifications" : "Enable notifications"}
          </Button>
        </div>
        <div className="settings-panel__group">
          <h3>Local data</h3>
          <div className="side-actions">
            <Button icon={Download} onClick={onExport}>
              Export JSON
            </Button>
            <Button icon={FileUp} onClick={onPickImport}>
              Import JSON
            </Button>
            <Button icon={Eraser} onClick={onClear} tone="danger">
              Clear data
            </Button>
          </div>
          <input
            accept="application/json"
            className="sr-only"
            onChange={onImport}
            ref={inputRef}
            type="file"
          />
        </div>
      </section>
    </div>
  );
}
