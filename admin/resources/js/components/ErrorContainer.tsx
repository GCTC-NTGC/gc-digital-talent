import { XCircleIcon } from "@heroicons/react/solid";
import React, { useCallback, useContext, useReducer } from "react";
import { toast } from "react-toastify";

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

const CloseButton = ({
  closeToast,
}: {
  closeToast: React.MouseEventHandler;
}) => {
  const { dispatch } = useContext(ErrorContext);
  const dismiss = useCallback(() => dispatch({ type: "pop" }), [dispatch]);
  return (
    <XCircleIcon
      style={{ width: "1rem" }}
      onClick={(e) => {
        dismiss();
        closeToast(e);
      }}
    />
  );
};

export const ErrorContainer: React.FC = ({ children }): React.ReactElement => {
  const [state, dispatch] = useReducer(errorReducer, initialState);
  const currentError = state.errorQueue.length > 0 ? state.errorQueue[0] : null;

  toast.error(currentError, {
    autoClose: false,
    closeButton: CloseButton,
  });

  return (
    <ErrorContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContainer;
