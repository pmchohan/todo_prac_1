import "./Button.css";

export function Button({
  children,
  className = "",
  icon: Icon,
  tone = "secondary",
  type = "button",
  ...props
}) {
  return (
    <button className={`button button--${tone} ${className}`} type={type} {...props}>
      {Icon ? <Icon aria-hidden="true" size={18} strokeWidth={2} /> : null}
      <span>{children}</span>
    </button>
  );
}
