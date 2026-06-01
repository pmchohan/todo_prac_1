import { addMonths, format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLayout } from "../../../layouts/SiteLayout/SiteLayout.jsx";
import { TaskEditor } from "../../../components/forms/TaskEditor/TaskEditor.jsx";
import { Toast } from "../../../components/feedback/Toast/Toast.jsx";
import {
  calculateStats,
  expandTasksForRange,
  filterTasksByStatsRange,
  filterTasksByView,
  getCalendarRange,
  matchesTaskQuery,
} from "../../../features/tasks/taskDates.js";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "../../../features/tasks/notificationService.js";
import { useTasks } from "../../../features/tasks/useTasks.js";
import { HomeContextPanel } from "./sections/HomeContextPanel.jsx";
import { HomeWorkspace } from "./sections/HomeWorkspace.jsx";
import { HomeViews } from "../../../components/domain/home/HomeViews.js";
import "./Home.css";

const DEFAULT_FILTERS = {
  query: "",
  type: "all",
  priority: "all",
  label: "",
};

export function Home() {
  const {
    addOrUpdateTask,
    clearData,
    clearToast,
    exportData,
    importData,
    isLoading,
    preferences,
    removeTask,
    setTaskStatus,
    tasks,
    toast,
    updatePreferences,
  } = useTasks();
  const [activeView, setActiveView] = useState("today");
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [statsRange, setStatsRange] = useState("today");
  const [notificationPermission, setNotificationPermission] = useState(getNotificationPermission());
  const importInputRef = useRef(null);

  useEffect(() => {
    setNotificationPermission(getNotificationPermission());
  }, [preferences?.notificationsEnabled]);

  const visibleRange = useMemo(() => {
    if (activeView === "calendar") return getCalendarRange(anchorDate);
    const now = new Date();
    return { start: addMonths(now, -12), end: addMonths(now, 18) };
  }, [activeView, anchorDate]);

  const expandedTasks = useMemo(
    () => expandTasksForRange(tasks, visibleRange.start, visibleRange.end),
    [tasks, visibleRange],
  );
  const labels = useMemo(
    () => [...new Set(tasks.flatMap((task) => task.labels || []))].sort(),
    [tasks],
  );
  const filteredTasks = useMemo(() => {
    const viewDate = activeView === "pending" ? new Date() : anchorDate;
    const viewTasks =
      activeView === "calendar"
        ? expandedTasks.filter((task) => task.status !== "completed")
        : filterTasksByView(expandedTasks, activeView, viewDate);
    return viewTasks
      .filter((task) => matchesTaskQuery(task, filters))
      .sort((first, second) => new Date(first.dueAt || 0) - new Date(second.dueAt || 0));
  }, [activeView, anchorDate, expandedTasks, filters]);
  const stats = useMemo(
    () => calculateStats(filterTasksByStatsRange(tasks, statsRange)),
    [statsRange, tasks],
  );
  const activeViewLabel = HomeViews.find((view) => view.id === activeView)?.label || "Today";
  const theme = preferences?.theme || "light";
  const notificationsAreEnabled =
    preferences?.notificationsEnabled && notificationPermission === "granted";

  function openEditor(task = null) {
    setEditingTask(task);
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setEditingTask(null);
    setIsEditorOpen(false);
  }

  async function handleExport() {
    const payload = await exportData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `yaad-dehani-${format(new Date(), "yyyy-MM-dd")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await importData(JSON.parse(await file.text()));
    } finally {
      event.target.value = "";
    }
  }

  async function enableNotifications() {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    await updatePreferences({ notificationsEnabled: permission === "granted" });
  }

  async function disableNotifications() {
    await updatePreferences({ notificationsEnabled: false });
    setNotificationPermission(getNotificationPermission());
  }

  return (
    <SiteLayout
      activeView={activeView}
      isSidebarCollapsed={isSidebarCollapsed}
      onChangeView={setActiveView}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onToggleSidebar={() => setIsSidebarCollapsed((value) => !value)}
      onToggleTheme={() => updatePreferences({ theme: theme === "dark" ? "light" : "dark" })}
      theme={theme}
      views={HomeViews}
    >
      <HomeWorkspace
        activeView={activeView}
        activeViewLabel={activeViewLabel}
        anchorDate={anchorDate}
        filters={filters}
        isLoading={isLoading}
        labels={labels}
        onChangeAnchorDate={setAnchorDate}
        onChangeFilters={setFilters}
        onCompleteTask={(task) => setTaskStatus(task, "completed")}
        onCreateTask={() => openEditor()}
        onDeleteTask={removeTask}
        onEditTask={openEditor}
        onReopenTask={(task) => setTaskStatus(task, "open")}
        tasks={filteredTasks}
      />
      <HomeContextPanel
        importInputRef={importInputRef}
        isSettingsOpen={isSettingsOpen}
        notificationsAreEnabled={notificationsAreEnabled}
        onClear={clearData}
        onCloseSettings={() => setIsSettingsOpen(false)}
        onDisableNotifications={disableNotifications}
        onEnableNotifications={enableNotifications}
        onExport={handleExport}
        onImport={handleImport}
        onPickImport={() => importInputRef.current?.click()}
        onStatsRangeChange={setStatsRange}
        onThemeChange={(nextTheme) => updatePreferences({ theme: nextTheme })}
        preferences={preferences}
        stats={stats}
        statsRange={statsRange}
      />
      <TaskEditor
        initialTask={editingTask}
        isOpen={isEditorOpen}
        onClose={closeEditor}
        onSave={addOrUpdateTask}
      />
      <Toast onClose={clearToast} toast={toast} />
    </SiteLayout>
  );
}
