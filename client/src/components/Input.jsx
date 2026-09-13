import { forwardRef } from "react";
import FormField from "./FormField";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      error,
      hint,
      register,
      disabled,
      required,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputEl = (
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? "true" : "false"}
        className={`h-12 w-full rounded-card border border-slate-200 bg-white px-4 text-sm text-textPrimary
          outline-none transition placeholder:text-slate-400
          focus:border-primary focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-slate-400
          aria-invalid:border-danger aria-invalid:focus:ring-red-200 ${className}`}
        {...register}
        {...props}
      />
    );

    if (!label && !error && !hint) return inputEl;

    return (
      <FormField label={label} htmlFor={name} error={error} hint={hint} required={required}>
        {inputEl}
      </FormField>
    );
  }
);

Input.displayName = "Input";

export default Input;
