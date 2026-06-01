import {
  Bell,
  CalendarClock,
  Check,
  Pencil,
  Repeat,
  Trash2,
  Undo2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "../../atoms/Button/Button.jsx";
import "./TaskCard.css";

const TYPE_LABELS = {
  task: "Task",
  event: "Event",
  reminder: "Reminder",
};

export function TaskCard({ task, onComplete, onDelete, onEdit, onReopen }) {
  const dueDate = task.dueAt ? parseISO(task.dueAt) : null;
  const isCompleted = task.status === "completed";

  return (
    <article className={`task-card task-card--${task.priority}`}>
      <div className="task-card__body">
        <div className="task-card__meta">
          <span>{TYPE_LABELS[task.type]}</span>
          <span>{task.priority} priority</span>
          {task.repeatRule !== "none" ? (
            <span className="task-card__repeat">
              <Repeat aria-hidden="true" size={14} />
              {task.repeatRule}
            </span>
          ) : null}
        </div>
        <h3>{task.title}</h3>
        {task.notes ? <p>{task.notes}</p> : null}
        <div className="task-card__details">
          {dueDate ? (
            <span>
              <CalendarClock aria-hidden="true" size={16} />
              {format(dueDate, "EEE, MMM d · h:mm a")}
            </span>
          ) : null}
          {task.reminderAt ? (
            <span>
              <Bell aria-hidden="true" size={16} />
              Reminder set
            </span>
          ) : null}
        </div>
        {task.labels?.length ? (
          <div className="task-card__labels" aria-label="Labels">
            {task.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="task-card__actions">
        <Button icon={Pencil} onClick={() => onEdit(task)}>
          Edit
        </Button>
        {isCompleted ? (
          <Button icon={Undo2} onClick={() => onReopen(task)}>
            Reopen
          </Button>
        ) : null}
        <Button icon={Trash2} onClick={() => onDelete(task)} tone="danger">
          Delete
        </Button>
        {!isCompleted ? (
          <Button className="task-card__complete" icon={Check} onClick={() => onComplete(task)} tone="primary">
            Mark completed
          </Button>
        ) : null}
      </div>
    </article>
  );
}
