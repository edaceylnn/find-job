const FormField = ({ label, htmlFor, error, hint, required, children }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-textPrimary">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-xs text-danger" role="alert">
          {error}
        </span>
      ) : (
        hint && <span className="text-xs text-textSecondary">{hint}</span>
      )}
    </div>
  );
};

export default FormField;
