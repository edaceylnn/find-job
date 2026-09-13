import { forwardRef } from "react";
import FormField from "./FormField";

const Textarea = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      error,
      hint,
      register,
      disabled,
      required,
      rows = 4,
      className = "",
      ...props
    },
    ref
  ) => {
    const textareaEl = (
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        ref={ref}
        disabled={disabled}
        rows={rows}
        aria-invalid={error ? "true" : "false"}
        className={`min-h-[120px] w-full resize-none rounded-card border border-border-control bg-white px-4 py-3 text-sm text-textPrimary
          outline-none transition placeholder:text-slate-400
          focus:border-primary focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-slate-400
          aria-invalid:border-danger aria-invalid:focus:ring-red-200 ${className}`}
        {...register}
        {...props}
      />
    );

    if (!label && !error && !hint) return textareaEl;

    return (
      <FormField label={label} htmlFor={name} error={error} hint={hint} required={required}>
        {textareaEl}
      </FormField>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
