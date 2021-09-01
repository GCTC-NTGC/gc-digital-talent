import React, { useCallback, useContext, useReducer } from "react";
import { defineMessages, useIntl } from "react-intl";
import Alert from "./H2Components/Alert";

const messages = defineMessages({
  toastTitle: {
    id: "errorToast.title",
    defaultMessage: "Something went wrong!",
    description: "Title displayed on the Error Toast component.",
  },
  dismissLabel: {
    id: "errorToast.dismiss",
    defaultMessage: "Dismiss",
    description: "Label for the Error Toast dismiss button.",
  },
});

type ErrorState = {
  errorQueue: string[];
};

export type ErrorAction = { type: "push"; payload: string } | { type: "pop" };

const initialState: ErrorState = { errorQueue: [] };
function errorReducer(state: ErrorState, action: ErrorAction) {
  switch (action.type) {
    case "push":
      // Add payload to the end of the array.
      return { errorQueue: [...state.errorQueue, action.payload] };
    case "pop":
      // Remove the first element of the array.
      return { errorQueue: state.errorQueue.slice(1) };
    default:
      throw new Error("Undefined action type in errorReducer.");
  }
}

interface ErrorContextProps {
  state: ErrorState;
  dispatch: React.Dispatch<ErrorAction>;
}

export const ErrorContext = React.createContext<ErrorContextProps>({
  state: initialState,
  dispatch: () => {
    /* returns nothing */
  },
});

export const ErrorToast: React.FC = () => {
  const intl = useIntl();
  const { state, dispatch } = useContext(ErrorContext);
  const dismiss = useCallback(() => dispatch({ type: "pop" }), [dispatch]);

  // This toast will render the first error in the queue, if any.
  const currentError = state.errorQueue.length > 0 ? state.errorQueue[0] : null;

  return (
    <>
      {currentError !== null && (
        <Alert
          color="red"
          position="toast"
          dismissBtn={
            <Alert.DismissBtn
              onClick={dismiss}
              aria-label={intl.formatMessage(messages.dismissLabel)}
            >
              {intl.formatMessage(messages.dismissLabel)}
            </Alert.DismissBtn>
          }
        >
          <p>
            <strong>{intl.formatMessage(messages.toastTitle)}</strong>
          </p>
          <p>{currentError}</p>
        </Alert>
      )}
    </>
  );
};

export const ErrorContainer: React.FC = ({ children }): React.ReactElement => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  return (
    <ErrorContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <ErrorToast />
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContainer;
