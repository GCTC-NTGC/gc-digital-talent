import React, { useReducer } from "react";

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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch: (action) => {},
});

export const ErrorContainer: React.FunctionComponent = ({
  children,
}): React.ReactElement => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

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
