import { format, parseISO } from "date-fns";
import { TaskCard } from "../../../cards/TaskCard/TaskCard.jsx";
import { groupTasksByDay } from "../../../../features/tasks/taskDates.js";

export function TaskList({ onComplete, onDelete, onEdit, onReopen, tasks }) {
  const groupedTasks = groupTasksByDay(tasks);

  return (
    <div className="task-list">
      {Object.entries(groupedTasks).map(([day, dayTasks]) => (
        <section className="task-day" key={day}>
          <h2>{day === "No date" ? day : format(parseISO(day), "EEEE, MMMM d")}</h2>
          <div className="task-day__items">
            {dayTasks.map((task) => (
              <TaskCard
                key={task.occurrenceId || task.id}
                onComplete={onComplete}
                onDelete={onDelete}
                onEdit={onEdit}
                onReopen={onReopen}
                task={task}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
