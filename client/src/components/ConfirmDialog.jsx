import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  open,
  title = "Emin misin?",
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      showCloseButton={false}
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isLoading}>
            {isLoading ? "Siliniyor..." : confirmLabel}
          </Button>
        </>
      }
    />
  );
};

export default ConfirmDialog;
