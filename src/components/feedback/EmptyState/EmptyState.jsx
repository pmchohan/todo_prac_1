import { PlusCircle } from "lucide-react";
import { Button } from "../../atoms/Button/Button.jsx";
import "./EmptyState.css";

export function EmptyState({ title, message, onCreate }) {
  return (
    <section className="empty-state" aria-label={title}>
      <div className="empty-state__mark" aria-hidden="true">
        YD
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {onCreate ? (
        <Button icon={PlusCircle} onClick={onCreate} tone="primary">
          Add an entry
        </Button>
      ) : null}
    </section>
  );
}
