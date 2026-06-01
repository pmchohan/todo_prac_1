import { isReminderDue } from "./taskDates.js";

export const notificationService = {
  module: "browser-notifications",
};

export function canUseBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission() {
  if (!canUseBrowserNotifications()) {
    return "unsupported";
  }
  return Notification.requestPermission();
}

export function getNotificationPermission() {
  if (!canUseBrowserNotifications()) {
    return "unsupported";
  }
  return Notification.permission;
}

export function notifyTask(task) {
  if (!canUseBrowserNotifications() || Notification.permission !== "granted") {
    return false;
  }

  const notification = new Notification("Yaad-Dehani reminder", {
    body: task.title,
    tag: `yaad-dehani-${task.id}`,
    silent: false,
  });

  notification.onclick = () => window.focus();
  return true;
}

export function getDueReminderTasks(tasks, now = new Date()) {
  return tasks.filter((task) => isReminderDue(task, now));
}
