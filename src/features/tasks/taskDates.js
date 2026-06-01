import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export const taskDates = {
  module: "task-date-helpers",
};

export const TASK_TYPES = ["task", "event", "reminder"];
export const TASK_PRIORITIES = ["low", "medium", "high"];
export const REPEAT_RULES = ["none", "daily", "weekly", "monthly", "yearly"];

export function createTaskDraft(overrides = {}) {
  const now = new Date();
  return {
    title: "",
    notes: "",
    type: "task",
    status: "open",
    dueAt: format(now, "yyyy-MM-dd'T'HH:mm"),
    reminderAt: "",
    priority: "medium",
    labels: [],
    repeatRule: "none",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    reminderSentAt: "",
    ...overrides,
  };
}

export function serializeTask(input) {
  const nowIso = new Date().toISOString();
  const labels = Array.isArray(input.labels)
    ? input.labels
    : String(input.labels || "")
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean);

  return {
    ...createTaskDraft(),
    ...input,
    title: String(input.title || "").trim(),
    notes: String(input.notes || "").trim(),
    labels,
    dueAt: input.dueAt ? new Date(input.dueAt).toISOString() : "",
    reminderAt: input.reminderAt ? new Date(input.reminderAt).toISOString() : "",
    updatedAt: nowIso,
    createdAt: input.createdAt || nowIso,
  };
}

export function getTaskDate(task) {
  return task.dueAt ? parseISO(task.dueAt) : null;
}

export function getReminderDate(task) {
  return task.reminderAt ? parseISO(task.reminderAt) : null;
}

export function isReminderDue(task, now = new Date()) {
  const reminderDate = getReminderDate(task);
  if (!reminderDate || task.status === "completed" || task.reminderSentAt) {
    return false;
  }
  return !isAfter(reminderDate, now);
}

export function isPastDue(task, now = new Date()) {
  const dueDate = getTaskDate(task);
  return Boolean(dueDate && task.status !== "completed" && isBefore(dueDate, now));
}

export function getCalendarRange(anchorDate = new Date()) {
  const start = startOfWeek(startOfMonth(anchorDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(anchorDate), { weekStartsOn: 1 });
  return { start, end };
}

export function expandTaskForRange(task, start, end) {
  const firstDueDate = getTaskDate(task);
  if (!firstDueDate) return [];

  if (task.repeatRule === "none") {
    return isWithinInterval(firstDueDate, { start, end }) ? [task] : [];
  }

  const occurrences = [];
  let occurrenceDate = firstDueDate;
  let safetyCount = 0;

  while (isBefore(occurrenceDate, start)) {
    occurrenceDate = getNextOccurrenceDate(occurrenceDate, task.repeatRule);
    safetyCount += 1;
    if (safetyCount > 370) return occurrences;
  }

  while (!isAfter(occurrenceDate, end) && safetyCount <= 370) {
    occurrences.push({
      ...task,
      occurrenceId: `${task.id || task.createdAt}-${occurrenceDate.toISOString()}`,
      dueAt: occurrenceDate.toISOString(),
      isRecurringOccurrence: true,
    });
    occurrenceDate = getNextOccurrenceDate(occurrenceDate, task.repeatRule);
    safetyCount += 1;
  }

  return occurrences;
}

export function expandTasksForRange(tasks, start, end) {
  return tasks.flatMap((task) => expandTaskForRange(task, start, end));
}

export function getNextOccurrenceDate(date, repeatRule) {
  if (repeatRule === "daily") return addDays(date, 1);
  if (repeatRule === "weekly") return addWeeks(date, 1);
  if (repeatRule === "monthly") return addMonths(date, 1);
  if (repeatRule === "yearly") return addYears(date, 1);
  return date;
}

export function groupTasksByDay(tasks) {
  return tasks.reduce((groups, task) => {
    const dueDate = getTaskDate(task);
    const key = dueDate ? format(dueDate, "yyyy-MM-dd") : "No date";
    return { ...groups, [key]: [...(groups[key] || []), task] };
  }, {});
}

export function filterTasksByView(tasks, view, anchorDate = new Date()) {
  const today = startOfDay(anchorDate);
  const monthStart = startOfMonth(anchorDate);
  const monthEnd = endOfMonth(anchorDate);

  if (view === "archive") {
    return tasks.filter((task) => task.status === "completed");
  }

  const activeTasks = tasks.filter((task) => task.status !== "completed");

  if (view === "today") {
    return activeTasks.filter((task) => {
      const dueDate = getTaskDate(task);
      return dueDate && isSameDay(dueDate, today);
    });
  }

  if (view === "pending") {
    return activeTasks.filter((task) => isPastDue(task, anchorDate));
  }

  if (view === "upcoming") {
    const upcomingEnd = addDays(today, 7);
    return activeTasks.filter((task) => {
      const dueDate = getTaskDate(task);
      return (
        dueDate &&
        isAfter(dueDate, today) &&
        isWithinInterval(dueDate, { start: today, end: upcomingEnd })
      );
    });
  }

  if (view === "month") {
    return activeTasks.filter((task) => {
      const dueDate = getTaskDate(task);
      return dueDate && isWithinInterval(dueDate, { start: monthStart, end: monthEnd });
    });
  }

  return activeTasks;
}

export function getStatsRange(rangeKey, anchorDate = new Date()) {
  const today = startOfDay(anchorDate);
  if (rangeKey === "tomorrow") {
    const tomorrow = addDays(today, 1);
    return { start: tomorrow, end: addDays(tomorrow, 1) };
  }
  if (rangeKey === "month") {
    return { start: startOfMonth(today), end: endOfMonth(today) };
  }
  if (rangeKey === "year") {
    return { start: startOfYear(today), end: endOfYear(today) };
  }
  return { start: today, end: addDays(today, 1) };
}

export function filterTasksByStatsRange(tasks, rangeKey, anchorDate = new Date()) {
  const range = getStatsRange(rangeKey, anchorDate);
  return tasks.filter((task) => {
    const dueDate = getTaskDate(task);
    return dueDate && isWithinInterval(dueDate, range);
  });
}

export function calculateStats(tasks) {
  const buckets = {
    event: createStatsBucket("Events"),
    task: createStatsBucket("Tasks"),
    reminder: createStatsBucket("Reminders"),
    total: createStatsBucket("Total"),
  };

  for (const task of tasks) {
    addTaskToStatsBucket(buckets[task.type] || buckets.task, task);
    addTaskToStatsBucket(buckets.total, task);
  }

  return buckets;
}

function createStatsBucket(label) {
  return {
    label,
    count: 0,
    pending: 0,
    high: 0,
    completed: 0,
  };
}

function addTaskToStatsBucket(bucket, task) {
  bucket.count += 1;
  if (task.status === "completed") {
    bucket.completed += 1;
  } else {
    bucket.pending += 1;
  }
  if (task.priority === "high") {
    bucket.high += 1;
  }
}

export function matchesTaskQuery(task, filters) {
  const query = filters.query.trim().toLowerCase();
  const hasQuery =
    !query ||
    [task.title, task.notes, ...(task.labels || [])].some((value) =>
      String(value || "").toLowerCase().includes(query),
    );
  const hasType = filters.type === "all" || task.type === filters.type;
  const hasPriority = filters.priority === "all" || task.priority === filters.priority;
  const hasLabel =
    !filters.label ||
    (task.labels || []).some((label) => label.toLowerCase() === filters.label.toLowerCase());

  return hasQuery && hasType && hasPriority && hasLabel;
}
