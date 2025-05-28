import { useEffect } from "react";
import ProgressBar from "./ProgressBar";

const TIMER = 3000;

export default function DeleteConfirmation({
  onConfirm,
  onCancel,
  onConfirmIT,
  stateItalian,
  stateEnglish,
}) {
  useEffect(() => {
    console.log("TIMER SET");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    return () => {
      console.log("TIMER CLEANED");
      clearTimeout(timer);
    };
  }, [onConfirm]);

  useEffect(() => {
    console.log("TIMER SET");
    const timer = setTimeout(() => {
      onConfirmIT();
    }, TIMER);

    return () => {
      console.log("TIMER CLEANED");
      clearTimeout(timer);
    };
  }, [onConfirmIT]);

  return (
    <>
      {stateEnglish && !stateItalian ? (
        <div id="delete-confirmation">
          <h2>Are you sure?</h2>
          <p>Do you really want to remove this place?</p>
          <div id="confirmation-actions">
            <button onClick={onCancel} className="button-text">
              No
            </button>
            <button onClick={onConfirm} className="button">
              Yes
            </button>
          </div>
          <ProgressBar timer={TIMER} />
        </div>
      ) : (
        <div id="delete-confirmation">
          <h2>Sei sicuro?</h2>
          <p>Vuoi davvero rimuovere questo luogo?</p>
          <div id="confirmation-actions">
            <button onClick={onCancel} className="button-text">
              No
            </button>
            <button onClick={onConfirmIT} className="button">
              Si
            </button>
          </div>
          <ProgressBar timer={TIMER} />
        </div>
      )}
    </>
  );
}
