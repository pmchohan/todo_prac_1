import { describe, expect, it, beforeEach } from "vitest";
import {
  clearAppData,
  exportAppData,
  importAppData,
  initializeStorage,
  listTasks,
  saveTask,
  yaadDehaniDb,
} from "../../../src/storage/taskStore.js";
import { createTaskDraft } from "../../../src/features/tasks/taskDates.js";

describe("task storage", () => {
  beforeEach(async () => {
    await yaadDehaniDb.delete();
    await yaadDehaniDb.open();
    window.localStorage.clear();
  });

  it("initializes preferences without adding sample entries", async () => {
    await initializeStorage();
    const exported = await exportAppData();

    expect(exported.preferences.key).toBe("app");
    expect(exported.tasks).toHaveLength(0);
  });

  it("saves, exports, imports, and clears task data", async () => {
    await clearAppData();
    await saveTask(createTaskDraft({ title: "Pack bag" }));

    const exported = await exportAppData();
    expect(exported.tasks).toHaveLength(1);

    await importAppData(exported);
    expect(await listTasks()).toHaveLength(1);

    await clearAppData();
    expect(await listTasks()).toHaveLength(0);
  });
});
