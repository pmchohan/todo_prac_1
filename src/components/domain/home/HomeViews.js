import { AlertCircle, Archive, CalendarDays, CheckCircle2, Clock3, ListTodo } from "lucide-react";

export const HomeViews = [
  { id: "today", label: "Today", icon: CheckCircle2 },
  { id: "pending", label: "Pending", icon: AlertCircle },
  { id: "upcoming", label: "7 Days", icon: Clock3 },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "list", label: "List All", icon: ListTodo },
  { id: "month", label: "Month", icon: CalendarDays },
  { id: "archive", label: "Completed", icon: Archive },
];

export function getHomeViewDescription(view) {
  if (view === "today") return "What needs care before the day closes.";
  if (view === "pending") return "Overdue entries that still need to be marked complete.";
  if (view === "upcoming") return "Entries due in the next seven days after today.";
  if (view === "calendar") return "A month-shaped view of your tasks, reminders, and events.";
  if (view === "month") return "Everything active within this month.";
  if (view === "archive") return "Completed entries live here so your active views stay calm.";
  return "All pending entries, including overdue, undated, today, and later items.";
}
