import fieldStateStyles from "../styles";
import useFieldState from "./useFieldState";

/**
 * Gets hydrogen styles for a form input
 * based on its current state
 *
 * NOTE: Must be used within a FormProvider
 *
 * @param name  string    Name of the input
 * @param ignoreUnsaved   boolean   IF you should ignore state and always render default
 * @returns Record<string, string>
 */
const useFieldStateStylesDeprecated = (name: string, ignoreUnsaved = false) => {
  let fieldState = useFieldState(name ?? "");
  if (ignoreUnsaved && fieldState === "dirty") {
    fieldState = "unset";
  }

  return fieldStateStyles[fieldState] || {};
};

export default useFieldStateStylesDeprecated;
