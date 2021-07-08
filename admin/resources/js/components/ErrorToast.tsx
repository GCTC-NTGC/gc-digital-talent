import React, { useCallback, useContext } from "react";
import { ErrorContext } from "./ErrorContainer";
import Alert from "./H2Components/Alert";

export const ErrorToast: React.FC = () => {
  const { state, dispatch } = useContext(ErrorContext);
  const dismiss = useCallback(() => dispatch({ type: "pop" }), [dispatch]);

  // This toast will render the first error in the queue, if any.
  const currentError = state.errorQueue.length > 0 ? state.errorQueue[0] : null;

  return (
    <>
      {currentError !== null && (
        <Alert
          color="pink"
          position="toast"
          dismissBtn={
            <Alert.DismissBtn onClick={dismiss} aria-label="Dismiss">
              Dismiss
            </Alert.DismissBtn>
          }
        >
          <p>
            <strong>Something went wrong!</strong>
          </p>
          <p>{currentError}</p>
        </Alert>
      )}
    </>
  );
};

export default ErrorToast;
