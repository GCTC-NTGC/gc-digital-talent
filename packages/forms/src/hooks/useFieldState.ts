import { get, useFormState } from "react-hook-form";

import { FieldState } from "../types";

/**
 * Determines the fields current state
 *
 * NOTE: Must be used within a FormProvider
 *
 * @param string name The inputs name
 * @returns FieldState
 */
const useFieldState = (name: string, ignoreUnsaved = false): FieldState => {
  const { errors, dirtyFields } = useFormState();
  const isDirty = Boolean(get(dirtyFields, name, false));
  const isInvalid = get(errors, name, false) as boolean;

  if (isInvalid) {
    return "invalid";
  }

  if (isDirty && !ignoreUnsaved) {
    return "dirty";
  }

  return "unset";
};

export default useFieldState;
