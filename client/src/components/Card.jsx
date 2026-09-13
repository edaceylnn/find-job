const PADDING_CLASSES = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const RADIUS_CLASSES = {
  card: "rounded-card",
  panel: "rounded-panel",
};

const VARIANT_CLASSES = {
  default: "border border-slate-200 bg-white shadow-card",
  dashed: "border border-dashed border-primary/30 bg-primary-subtle/40",
};

const Card = ({
  children,
  as: Tag = "div",
  padding = "md",
  radius = "card",
  variant = "default",
  interactive = false,
  className = "",
}) => {
  return (
    <Tag
      className={`${VARIANT_CLASSES[variant]} ${RADIUS_CLASSES[radius]} ${PADDING_CLASSES[padding]} ${
        interactive ? "transition duration-150 hover:-translate-y-px hover:border-primary/30 hover:shadow-card" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Card;
