import { Location, useLocation } from "react-router";

interface LocationState {
  from?: string;
}

function useReturnPath(fallback: string): string {
  const { state } = useLocation() as Location<LocationState>;

  return state?.from ?? fallback;
}

export default useReturnPath;
