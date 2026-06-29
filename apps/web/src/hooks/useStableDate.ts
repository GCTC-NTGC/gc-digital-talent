import { useState } from "react";

/**
 * Returns a stable Date object representing the time the component mounted.
 * This satisfies React purity rules by avoiding dynamic Date calls during render.
 */
export const useStableDate = (): Date => {
  const [now] = useState<Date>(() => new Date());
  return now;
};
