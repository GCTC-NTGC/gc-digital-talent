import { useContext } from "react";

import { ActivityContext } from "./ActivityContainer";
import { ActivityState } from "./types";

const useActivity = (): ActivityState => {
  const ctx = useContext(ActivityContext);

  return ctx;
};

export default useActivity;
