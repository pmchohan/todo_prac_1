import { Bell, CalendarPlus, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createTaskDraft, serializeTask } from "../../../features/tasks/taskDates.js";
import { Button } from "../../atoms/Button/Button.jsx";
import { FieldLabel } from "./FieldLabel.jsx";
import "./TaskEditor.css";

const FIELD_TIPS = {
  title: "Use a short, familiar phrase. You can add details in notes.",
  notes: "Optional context like a location, person, or small instruction.",
  type: "Tasks are actions, events happen at a time, reminders nudge you gently.",
  priority: "High priority entries appear in stats so they are harder to miss.",
  dueAt: "When this entry belongs on your calendar or list.",
  reminderAt: "When Yaad-Dehani should nudge you while the app is open.",
  repeatRule: "Repeat creates calendar occurrences without duplicating the original entry.",
  labels: "Comma-separated labels help you filter later, such as family or errands.",
};

export function TaskEditor({ initialTask, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(createTaskDraft());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setForm(toFormTask(initialTask || createTaskDraft()));
    setError("");
  }, [initialTask, isOpen]);

  const title = useMemo(() => (initialTask ? "Edit entry" : "Add an entry"), [initialTask]);

  if (!isOpen) return null;

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Please add a short title so this entry is easy to find later.");
      return;
    }
    await onSave(serializeTask({ ...form, id: initialTask?.id }));
    onClose();
  }

  return (
    <div className="modal-shell" role="presentation">
      <button aria-label="Close editor" className="modal-scrim" onClick={onClose} type="button" />
      <section
        aria-labelledby="task-editor-title"
        aria-modal="true"
        className="task-editor"
        role="dialog"
      >
        <header>
          <div>
            <p className="eyebrow">Yaad-Dehani</p>
            <h2 id="task-editor-title">{title}</h2>
          </div>
          <button aria-label="Close editor" className="icon-button" onClick={onClose} type="button">
            <X aria-hidden="true" size={20} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <label htmlFor="task-editor-title-field">
            <FieldLabel tip={FIELD_TIPS.title}>Title</FieldLabel>
            <input
              autoFocus
              id="task-editor-title-field"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="What should be remembered?"
            />
          </label>
          <label htmlFor="task-editor-notes-field">
            <FieldLabel tip={FIELD_TIPS.notes}>Notes</FieldLabel>
            <textarea
              id="task-editor-notes-field"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Add a detail, place, or thought."
              rows="4"
            />
          </label>
          <div className="form-grid">
            <label htmlFor="task-editor-type-field">
              <FieldLabel tip={FIELD_TIPS.type}>Type</FieldLabel>
              <select
                id="task-editor-type-field"
                value={form.type}
                onChange={(event) => updateField("type", event.target.value)}
              >
                <option value="task">Task</option>
                <option value="event">Event</option>
                <option value="reminder">Reminder</option>
              </select>
            </label>
            <label htmlFor="task-editor-priority-field">
              <FieldLabel tip={FIELD_TIPS.priority}>Priority</FieldLabel>
              <select
                id="task-editor-priority-field"
                value={form.priority}
                onChange={(event) => updateField("priority", event.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <div className="form-grid">
            <label htmlFor="task-editor-due-field">
              <FieldLabel tip={FIELD_TIPS.dueAt}>Due date and time</FieldLabel>
              <input
                id="task-editor-due-field"
                value={form.dueAt}
                onChange={(event) => updateField("dueAt", event.target.value)}
                type="datetime-local"
              />
            </label>
            <label htmlFor="task-editor-reminder-field">
              <FieldLabel tip={FIELD_TIPS.reminderAt}>Reminder</FieldLabel>
              <input
                id="task-editor-reminder-field"
                value={form.reminderAt}
                onChange={(event) => updateField("reminderAt", event.target.value)}
                type="datetime-local"
              />
            </label>
          </div>
          <div className="form-grid">
            <label htmlFor="task-editor-repeat-field">
              <FieldLabel tip={FIELD_TIPS.repeatRule}>Repeat</FieldLabel>
              <select
                id="task-editor-repeat-field"
                value={form.repeatRule}
                onChange={(event) => updateField("repeatRule", event.target.value)}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
            <label htmlFor="task-editor-labels-field">
              <FieldLabel tip={FIELD_TIPS.labels}>Labels</FieldLabel>
              <input
                id="task-editor-labels-field"
                value={form.labels}
                onChange={(event) => updateField("labels", event.target.value)}
                placeholder="family, work, errands"
              />
            </label>
          </div>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <footer>
            <Button icon={CalendarPlus} onClick={onClose}>
              Cancel
            </Button>
            <Button icon={Save} tone="primary" type="submit">
              Save entry
            </Button>
          </footer>
        </form>
        <p className="task-editor__hint">
          <Bell aria-hidden="true" size={16} />
          Browser reminders work best while Yaad-Dehani is open.
        </p>
      </section>
    </div>
  );
}

function toFormTask(task) {
  return {
    ...task,
    dueAt: toDatetimeLocal(task.dueAt),
    reminderAt: toDatetimeLocal(task.reminderAt),
    labels: (task.labels || []).join(", "),
  };
}

function toDatetimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
