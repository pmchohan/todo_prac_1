import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskEditor } from "../../../../../src/components/forms/TaskEditor/TaskEditor.jsx";

describe("TaskEditor", () => {
  it("shows a helpful validation message when title is missing", async () => {
    const user = userEvent.setup();
    render(<TaskEditor isOpen onClose={vi.fn()} onSave={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /save entry/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("Please add a short title");
  });

  it("saves a filled entry", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<TaskEditor isOpen onClose={vi.fn()} onSave={onSave} />);

    await user.type(screen.getByLabelText(/title/i), "Visit market");
    await user.click(screen.getByRole("button", { name: /save entry/i }));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: "Visit market" }));
  });
});
