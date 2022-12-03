import ButtonWithProgress from "./ButtonWithProgress";

export const Modal = ({
  content,
  confirmButton = "Yes",
  cancelButton = "Cancel",
  onClickCancel = () => console.log("onClickCancel is not set"),
  onClickConfirm = () => console.log("onClickConfirm is not set"),
  apiProgress = false,
}) => {
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document" data-testid="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel"></h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{content}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={onClickCancel}
            >
              {cancelButton}
            </button>
            <ButtonWithProgress
              type="button"
              className="btn btn-primary"
              onClick={onClickConfirm}
              apiProgress={apiProgress}
            >
              {confirmButton}
            </ButtonWithProgress>
          </div>
        </div>
      </div>
    </div>
  );
};
