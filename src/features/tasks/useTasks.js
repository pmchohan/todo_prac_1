import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearAppData,
  deleteTask,
  exportAppData,
  getPreferences,
  importAppData,
  initializeStorage,
  listTasks,
  restoreTask,
  savePreferences,
  saveTask,
  updateTask,
} from "../../storage/taskStore.js";
import { getDueReminderTasks, notifyTask } from "./notificationService.js";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const refreshData = useCallback(async () => {
    const [nextTasks, nextPreferences] = await Promise.all([listTasks(), getPreferences()]);
    setTasks(nextTasks);
    setPreferences(nextPreferences);
    document.documentElement.dataset.theme = nextPreferences.theme;
  }, []);

  useEffect(() => {
    let isMounted = true;
    initializeStorage()
      .then(refreshData)
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [refreshData]);

  useEffect(() => {
    if (!tasks.length || !preferences?.notificationsEnabled) return undefined;
    const intervalId = window.setInterval(async () => {
      const dueReminderTasks = getDueReminderTasks(tasks);
      for (const task of dueReminderTasks) {
        notifyTask(task);
        await updateTask(task.id, { reminderSentAt: new Date().toISOString() });
        setToast({ tone: "reminder", message: `Reminder: ${task.title}` });
      }
      if (dueReminderTasks.length) {
        await refreshData();
      }
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, [preferences?.notificationsEnabled, refreshData, tasks]);

  const taskStats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status !== "completed").length,
      completed: tasks.filter((task) => task.status === "completed").length,
      high: tasks.filter((task) => task.priority === "high").length,
    }),
    [tasks],
  );

  const addOrUpdateTask = useCallback(
    async (task) => {
      await saveTask(task);
      await refreshData();
      setToast({
        tone: "success",
        message: task.id
          ? "Your entry has been updated and tucked back into Yaad-Dehani."
          : "Your new entry has been added to Yaad-Dehani.",
      });
    },
    [refreshData],
  );

  const setTaskStatus = useCallback(
    async (task, status) => {
      await updateTask(task.id, { status });
      await refreshData();
      setToast({
        tone: "success",
        message:
          status === "completed"
            ? "Marked complete. You can find it later in Completed."
            : "Reopened and returned to your active list.",
      });
    },
    [refreshData],
  );

  const removeTask = useCallback(
    async (task) => {
      const deletedTask = await deleteTask(task.id);
      await refreshData();
      setToast({
        tone: "danger",
        message: "Entry deleted. You can undo this for a few seconds.",
        actionLabel: "Undo",
        onAction: async () => {
          await restoreTask(deletedTask);
          await refreshData();
          setToast({ tone: "success", message: "Entry restored and returned to your list." });
        },
      });
    },
    [refreshData],
  );

  const updatePreferences = useCallback(
    async (patch) => {
      const nextPreferences = await savePreferences(patch);
      setPreferences(nextPreferences);
      document.documentElement.dataset.theme = nextPreferences.theme;
      setToast({ tone: "success", message: "Preference saved. Yaad-Dehani will remember this here." });
    },
    [],
  );

  const exportData = useCallback(async () => exportAppData(), []);

  const importData = useCallback(
    async (payload) => {
      await importAppData(payload);
      await refreshData();
      setToast({ tone: "success", message: "Data imported. Your local entries are ready." });
    },
    [refreshData],
  );

  const clearData = useCallback(async () => {
    await clearAppData();
    await refreshData();
    setToast({ tone: "danger", message: "Local data cleared from this browser." });
  }, [refreshData]);

  return {
    tasks,
    preferences,
    isLoading,
    toast,
    taskStats,
    addOrUpdateTask,
    clearData,
    clearToast: useCallback(() => setToast(null), []),
    exportData,
    importData,
    removeTask,
    setTaskStatus,
    updatePreferences,
  };
}
