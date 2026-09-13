const SIZE_CLASSES = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

const SHAPE_CLASSES = {
  circle: "rounded-control",
  square: "rounded-card",
};

const Avatar = ({
  src,
  alt = "",
  size = "sm",
  shape = "circle",
  ring = false,
  fallback,
  className = "",
}) => {
  const baseClasses = `${SIZE_CLASSES[size]} ${SHAPE_CLASSES[shape]} shrink-0 bg-surface-subtle object-cover ${
    ring ? "ring-1 ring-slate-200" : ""
  } ${className}`;

  if (!src && fallback) {
    return (
      <div className={`flex items-center justify-center ${baseClasses}`}>
        {fallback}
      </div>
    );
  }

  return <img src={src} alt={alt} className={baseClasses} />;
};

export default Avatar;
