import { FiInbox } from "react-icons/fi";
import Button from "./Button";
import Card from "./Card";

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = "",
}) => {
  return (
    <Card
      variant="dashed"
      radius="panel"
      className={`flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center ${className}`}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-panel bg-white text-2xl text-primary shadow-card">
        {icon || <FiInbox />}
      </div>
      <h2 className="text-lg font-semibold text-textPrimary">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-textSecondary">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;
