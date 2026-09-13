const SIZE_CLASSES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-[42px] px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const VARIANT_CLASSES = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active",
  secondary: "border border-primary text-primary hover:bg-primary-subtle active:bg-primary-subtle-active",
  outline: "border border-border-control text-textSecondary hover:bg-surface-subtle",
  ghost: "text-textSecondary hover:bg-surface-subtle",
  danger: "bg-danger text-white hover:bg-danger-hover",
};

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  as = "button",
  type = "button",
  iconLeft,
  iconRight,
  className = "",
  children,
  ...rest
}) => {
  const classes = `inline-flex items-center justify-center rounded-control font-semibold
    transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2
    ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {loading ? <Spinner /> : iconLeft}
      {children}
      {!loading && iconRight}
    </>
  );

  if (as === "label") {
    return (
      <label className={`${classes} ${disabled ? "pointer-events-none" : ""}`} {...rest}>
        {content}
      </label>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
