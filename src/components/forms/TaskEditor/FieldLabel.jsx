import { useRef, useState } from "react";
import { createPortal } from "react-dom";

export function FieldLabel({ children, tip }) {
  const tipRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  function showTooltip() {
    const rect = tipRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPosition({
      left: rect.left + rect.width / 2,
      top: rect.top - 8,
    });
  }

  function hideTooltip() {
    setTooltipPosition(null);
  }

  function placeTooltip(node) {
    if (!node || !tooltipPosition) return;
    node.style.left = `${tooltipPosition.left}px`;
    node.style.top = `${tooltipPosition.top}px`;
  }

  return (
    <span className="field-label">
      <span>{children}</span>
      <span
        aria-label={tip}
        className="field-tip"
        onBlur={hideTooltip}
        onFocus={showTooltip}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        ref={tipRef}
        tabIndex="0"
      >
        i
        {tooltipPosition
          ? createPortal(
              <span
                className="field-tip-tooltip"
                ref={placeTooltip}
                role="tooltip"
              >
                {tip}
              </span>,
              document.body,
            )
          : null}
      </span>
    </span>
  );
}
