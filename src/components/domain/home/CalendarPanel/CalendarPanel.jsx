import { eachDayOfInterval, format, isSameDay, parseISO } from "date-fns";
import { Button } from "../../../atoms/Button/Button.jsx";
import { getCalendarRange } from "../../../../features/tasks/taskDates.js";

export function CalendarPanel({ anchorDate, onNextMonth, onPreviousMonth, onTaskClick, tasks }) {
  const range = getCalendarRange(anchorDate);
  const days = eachDayOfInterval(range);

  return (
    <section className="calendar-panel" aria-label="Calendar view">
      <header>
        <Button onClick={onPreviousMonth}>Previous</Button>
        <h2>{format(anchorDate, "MMMM yyyy")}</h2>
        <Button onClick={onNextMonth}>Next</Button>
      </header>
      <div className="calendar-grid" role="grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div className="calendar-grid__weekday" key={day}>
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayTasks = tasks.filter((task) => task.dueAt && isSameDay(parseISO(task.dueAt), day));
          return (
            <div className="calendar-cell" key={day.toISOString()} role="gridcell">
              <span>{format(day, "d")}</span>
              {dayTasks.slice(0, 3).map((task) => (
                <button key={task.occurrenceId || task.id} onClick={() => onTaskClick(task)} type="button">
                  {task.title}
                </button>
              ))}
              {dayTasks.length > 3 ? <small>+{dayTasks.length - 3} more</small> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
