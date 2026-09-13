const SIZE_CLASSES = {
  xl: "text-lg font-semibold",
  lg: "text-base font-semibold leading-6",
};

const PageTitle = ({
  children,
  subtitle,
  size = "xl",
  as: Tag = "h1",
  className = "",
}) => {
  return (
    <div>
      <Tag className={`${SIZE_CLASSES[size]} text-textPrimary ${className}`}>
        {children}
      </Tag>
      {subtitle && (
        <p className="mt-2 text-sm text-textSecondary">{subtitle}</p>
      )}
    </div>
  );
};

export default PageTitle;
