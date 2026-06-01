import { Search } from "lucide-react";
import "./FilterBar.css";

export function FilterBar({ filters, labels, onChange }) {
  return (
    <form className="filter-bar" role="search" onSubmit={(event) => event.preventDefault()}>
      <label className="filter-bar__search" htmlFor="task-search">
        <span className="sr-only">Search entries</span>
        <Search aria-hidden="true" size={18} />
        <input
          id="task-search"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Search notes, labels, or titles"
          type="search"
        />
      </label>
      <label htmlFor="task-type-filter">
        <span>Type</span>
        <select
          id="task-type-filter"
          value={filters.type}
          onChange={(event) => onChange({ ...filters, type: event.target.value })}
        >
          <option value="all">All</option>
          <option value="task">Tasks</option>
          <option value="event">Events</option>
          <option value="reminder">Reminders</option>
        </select>
      </label>
      <label htmlFor="task-priority-filter">
        <span>Priority</span>
        <select
          id="task-priority-filter"
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value })}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>
      <label htmlFor="task-label-filter">
        <span>Label</span>
        <select
          id="task-label-filter"
          value={filters.label}
          onChange={(event) => onChange({ ...filters, label: event.target.value })}
        >
          <option value="">Any</option>
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
