import { describe, expect, it } from "vitest";
import {
  createTaskDraft,
  expandTaskForRange,
  groupTasksByDay,
  isReminderDue,
  calculateStats,
  filterTasksByView,
  serializeTask,
} from "../../../../src/features/tasks/taskDates.js";

describe("task date helpers", () => {
  it("serializes labels and timestamps into a stable task shape", () => {
    const task = serializeTask(
      createTaskDraft({
        title: "  Pay bill  ",
        dueAt: "2026-06-01T10:00",
        labels: "home, money",
      }),
    );

    expect(task.title).toBe("Pay bill");
    expect(task.labels).toEqual(["home", "money"]);
    expect(task.dueAt).toBe("2026-06-01T05:00:00.000Z");
  });

  it("detects reminders that are due and have not been sent", () => {
    const task = createTaskDraft({
      title: "Call",
      reminderAt: "2026-06-01T09:00:00.000Z",
    });

    expect(isReminderDue(task, new Date("2026-06-01T09:01:00.000Z"))).toBe(true);
    expect(isReminderDue({ ...task, reminderSentAt: "2026-06-01T09:01:00.000Z" })).toBe(false);
  });

  it("expands weekly repeating entries within a range", () => {
    const task = serializeTask(
      createTaskDraft({
        id: 7,
        title: "Review",
        dueAt: "2026-06-01T10:00:00.000Z",
        repeatRule: "weekly",
      }),
    );

    const occurrences = expandTaskForRange(
      task,
      new Date("2026-06-01T00:00:00.000Z"),
      new Date("2026-06-22T23:59:59.000Z"),
    );

    expect(occurrences).toHaveLength(4);
    expect(occurrences[1].occurrenceId).toContain("2026-06-08");
  });

  it("expands yearly repeating entries within a range", () => {
    const task = serializeTask(
      createTaskDraft({
        id: 9,
        title: "Annual review",
        dueAt: "2026-06-01T10:00:00.000Z",
        repeatRule: "yearly",
      }),
    );

    const occurrences = expandTaskForRange(
      task,
      new Date("2026-01-01T00:00:00.000Z"),
      new Date("2028-12-31T23:59:59.000Z"),
    );

    expect(occurrences).toHaveLength(3);
    expect(occurrences[2].occurrenceId).toContain("2028-06-01");
  });

  it("groups tasks by due day", () => {
    const groups = groupTasksByDay([
      createTaskDraft({ title: "One", dueAt: "2026-06-01T10:00:00.000Z" }),
      createTaskDraft({ title: "Two", dueAt: "2026-06-01T12:00:00.000Z" }),
    ]);

    expect(groups["2026-06-01"]).toHaveLength(2);
  });

  it("counts incomplete overdue entries as pending until manually completed", () => {
    const stats = calculateStats([
      createTaskDraft({
        title: "Expired but not done",
        type: "event",
        status: "open",
        dueAt: "2026-05-31T10:00:00.000Z",
      }),
      createTaskDraft({
        title: "Finished",
        type: "event",
        status: "completed",
        dueAt: "2026-05-31T11:00:00.000Z",
      }),
    ]);

    expect(stats.event.count).toBe(2);
    expect(stats.event.pending).toBe(1);
    expect(stats.event.completed).toBe(1);
  });

  it("filters pending entries by passed due datetime and manual completion", () => {
    const tasks = [
      createTaskDraft({
        title: "Overdue",
        dueAt: "2026-06-01T08:00:00.000Z",
        status: "open",
      }),
      createTaskDraft({
        title: "Already done",
        dueAt: "2026-06-01T07:00:00.000Z",
        status: "completed",
      }),
      createTaskDraft({
        title: "Later",
        dueAt: "2026-06-01T12:00:00.000Z",
        status: "open",
      }),
    ];

    const pending = filterTasksByView(tasks, "pending", new Date("2026-06-01T10:00:00.000Z"));

    expect(pending).toHaveLength(1);
    expect(pending[0].title).toBe("Overdue");
  });
});
