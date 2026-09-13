import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { BsCheck2, BsChevronExpand } from "react-icons/bs";
import FormField from "./FormField";

const normalizeOption = (opt) =>
  typeof opt === "string" ? { value: opt, label: opt } : opt;

const Select = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Seç",
  error,
  disabled,
  className = "",
}) => {
  const normalized = options.map(normalizeOption);
  const selected = normalized.find((o) => o.value === value);

  const selectEl = (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={`relative ${className}`}>
        <Listbox.Button
          aria-invalid={error ? "true" : "false"}
          className="relative h-12 w-full cursor-default rounded-card border border-slate-200 bg-white pl-4 pr-10 text-left text-sm text-textPrimary
            outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20
            disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-slate-400
            aria-invalid:border-danger"
        >
          <span className="block truncate">{selected?.label || placeholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <BsChevronExpand className="h-4 w-4 text-textSecondary" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-card bg-white py-1 text-sm shadow-panel ring-1 ring-black/5 focus:outline-none">
            {normalized.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-primary-subtle text-primary-hover" : "text-textPrimary"
                  }`
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <span className={`block truncate ${isSelected ? "font-medium" : "font-normal"}`}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-hover">
                        <BsCheck2 className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );

  if (!label && !error) return selectEl;

  return (
    <FormField label={label} error={error}>
      {selectEl}
    </FormField>
  );
};

export default Select;
