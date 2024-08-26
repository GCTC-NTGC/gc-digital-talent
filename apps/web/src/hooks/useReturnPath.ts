import { useLocation } from "react-router-dom";

type LocationState = {
  from?: string;
};

/**
 * Gets the previous page from location states
 * falling back to a default path
 *
 * NOTE: helps to avoid needing to type cast this state everywhere
 */
function useReturnPath(defaultPath: string): string {
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  return state?.from ?? defaultPath;
}

export default useReturnPath;
