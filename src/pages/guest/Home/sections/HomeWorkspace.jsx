import { addMonths, subMonths } from "date-fns";
import { PlusCircle } from "lucide-react";
import { Button } from "../../../../components/atoms/Button/Button.jsx";
import { CalendarPanel } from "../../../../components/domain/home/CalendarPanel/CalendarPanel.jsx";
import { getHomeViewDescription } from "../../../../components/domain/home/HomeViews.js";
import { TaskList } from "../../../../components/domain/home/TaskList/TaskList.jsx";
import { EmptyState } from "../../../../components/feedback/EmptyState/EmptyState.jsx";
import { FilterBar } from "../../../../components/forms/FilterBar/FilterBar.jsx";

export function HomeWorkspace({
  activeView,
  activeViewLabel,
  anchorDate,
  filters,
  isLoading,
  labels,
  onChangeAnchorDate,
  onChangeFilters,
  onCompleteTask,
  onCreateTask,
  onDeleteTask,
  onEditTask,
  onReopenTask,
  tasks,
}) {
  const canCreateEntry = activeView !== "archive";

  return (
    <section className="workspace" aria-labelledby="view-title">
      <header className="workspace__header">
        <div>
          <p className="eyebrow">Private browser memory</p>
          <h1 id="view-title">{activeViewLabel}</h1>
          <p>{getHomeViewDescription(activeView)}</p>
        </div>
        {canCreateEntry ? (
          <Button icon={PlusCircle} onClick={onCreateTask} tone="primary">
            Add entry
          </Button>
        ) : null}
      </header>
      <FilterBar filters={filters} labels={labels} onChange={onChangeFilters} />
      {isLoading ? (
        <div className="loading-panel" role="status">
          Opening your diary...
        </div>
      ) : activeView === "calendar" ? (
        <CalendarPanel
          anchorDate={anchorDate}
          onNextMonth={() => onChangeAnchorDate((date) => addMonths(date, 1))}
          onPreviousMonth={() => onChangeAnchorDate((date) => subMonths(date, 1))}
          onTaskClick={onEditTask}
          tasks={tasks}
        />
      ) : tasks.length ? (
        <TaskList
          onComplete={onCompleteTask}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          onReopen={onReopenTask}
          tasks={tasks}
        />
      ) : (
        <EmptyState
          title="Nothing asking for your attention here"
          message={
            canCreateEntry
              ? "Add one small entry, or switch views to see what is waiting elsewhere."
              : "Completed entries will appear here after you manually mark them done."
          }
          onCreate={canCreateEntry ? onCreateTask : undefined}
        />
      )}
    </section>
  );
}
