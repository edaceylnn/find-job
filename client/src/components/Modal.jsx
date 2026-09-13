import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import IconButton from "./IconButton";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const Modal = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  footer,
  children,
}) => {
  return (
    <Transition appear show={open || false} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnBackdropClick ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`flex max-h-[92vh] w-full ${SIZE_CLASSES[size]} transform flex-col overflow-hidden rounded-t-panel bg-white text-left align-middle shadow-panel transition-all sm:max-h-[85vh] sm:rounded-panel`}
              >
                {(title || showCloseButton) && (
                  <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-white px-5 py-4 sm:px-6 sm:py-5">
                    <div>
                      {title && (
                        <Dialog.Title className="text-base font-semibold leading-6 text-textPrimary">
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <p className="mt-2 text-sm text-textSecondary">{description}</p>
                      )}
                    </div>

                    {showCloseButton && (
                      <IconButton
                        icon={<FiX />}
                        label="Kapat"
                        variant="outline"
                        onClick={onClose}
                      />
                    )}
                  </div>
                )}

                {children && (
                  <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                    {children}
                  </div>
                )}

                {footer && (
                  <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
