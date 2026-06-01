import Dexie from "dexie";
import { serializeTask } from "../features/tasks/taskDates.js";

export const taskStore = {
  module: "dexie-task-store",
};

export const yaadDehaniDb = new Dexie("yaadDehani");

yaadDehaniDb.version(1).stores({
  tasks: "++id, status, type, dueAt, reminderAt, priority, updatedAt",
  preferences: "&key",
});

export const DEFAULT_PREFERENCES = {
  key: "app",
  theme: "light",
  notificationsEnabled: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function initializeStorage() {
  const existingPreferences = await yaadDehaniDb.preferences.get("app");
  if (!existingPreferences) {
    await yaadDehaniDb.preferences.put(DEFAULT_PREFERENCES);
  }
}

export async function listTasks() {
  return yaadDehaniDb.tasks.orderBy("dueAt").toArray();
}

export async function saveTask(task) {
  const serializedTask = serializeTask(task);
  if (task.id) {
    await yaadDehaniDb.tasks.put({ ...serializedTask, id: task.id });
    return task.id;
  }
  return yaadDehaniDb.tasks.add(serializedTask);
}

export async function updateTask(taskId, patch) {
  return yaadDehaniDb.tasks.update(taskId, {
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTask(taskId) {
  const task = await yaadDehaniDb.tasks.get(taskId);
  await yaadDehaniDb.tasks.delete(taskId);
  return task;
}

export async function restoreTask(task) {
  if (!task) return null;
  const { id, ...taskWithoutId } = task;
  return yaadDehaniDb.tasks.add(taskWithoutId);
}

export async function getPreferences() {
  return (await yaadDehaniDb.preferences.get("app")) || DEFAULT_PREFERENCES;
}

export async function savePreferences(patch) {
  const existingPreferences = await getPreferences();
  const preferences = {
    ...existingPreferences,
    ...patch,
    key: "app",
    updatedAt: new Date().toISOString(),
  };
  await yaadDehaniDb.preferences.put(preferences);
  document.cookie = `yaad-dehani-theme=${preferences.theme}; path=/; max-age=31536000; SameSite=Lax`;
  return preferences;
}

export async function exportAppData() {
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    tasks: await listTasks(),
    preferences: await getPreferences(),
  };
}

export async function importAppData(payload) {
  if (!payload || !Array.isArray(payload.tasks)) {
    throw new Error("Import file must include a tasks array.");
  }

  await yaadDehaniDb.transaction("rw", yaadDehaniDb.tasks, yaadDehaniDb.preferences, async () => {
    await yaadDehaniDb.tasks.clear();
    await yaadDehaniDb.tasks.bulkAdd(payload.tasks.map((task) => serializeTask(task)));
    if (payload.preferences) {
      await savePreferences(payload.preferences);
    }
  });
}

export async function clearAppData() {
  await yaadDehaniDb.tasks.clear();
  await yaadDehaniDb.preferences.put(DEFAULT_PREFERENCES);
}
