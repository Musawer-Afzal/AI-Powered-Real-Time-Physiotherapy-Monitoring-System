import "./ConfirmModal.css";

export default function ConfirmModal({
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel
}) {

    if (!open) return null;
    return (
        <div className="modal-overlay">
            <div className="confirm-modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="delete-btn"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}