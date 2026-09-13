const SIZE_CLASSES = {
  sm: "h-9 w-9 text-base",
  md: "h-10 w-10 text-lg",
  lg: "h-12 w-12 text-xl",
};

const VARIANT_CLASSES = {
  ghost: "text-textSecondary hover:bg-surface-subtle hover:text-primary",
  solid: "bg-white/90 text-primary shadow-card hover:bg-primary-subtle",
  outline: "border border-border-control text-textSecondary hover:border-primary hover:text-primary hover:bg-primary-subtle",
};

const IconButton = ({
  icon,
  label,
  variant = "ghost",
  size = "md",
  disabled = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-control
        transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2
        ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
};

export default IconButton;
