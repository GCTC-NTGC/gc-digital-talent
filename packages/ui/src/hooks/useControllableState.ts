import React from "react";

import useCallbackRef from "./useCallbackRef";

type UseControllableStateArgs<T> = {
  // The state prop being controlled
  controlledProp?: T | undefined;
  // A default value for the state
  defaultValue: T | undefined;
  // Callback for when state changes
  onChange?: (state: T) => void;
};

type SetStateFunc<T> = (prevState?: T) => T;

const useUnControlledState = <T>({
  defaultValue,
  onChange,
}: Omit<UseControllableStateArgs<T>, "controlledProp">) => {
  const unControlledState = React.useState<T | undefined>(defaultValue);
  const [value] = unControlledState;
  const prevValueRef = React.useRef(value);
  const handleChange = useCallbackRef(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return unControlledState;
};

/**
 * A controlled version of React.useState
 *
 * Ref: https://github.com/radix-ui/primitives/tree/main/packages/react/use-controllable-state
 */
const useControllableState = <T>({
  controlledProp,
  defaultValue,
  // Note: Setting a default here ( we do want it to be empty )
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = () => {},
}: UseControllableStateArgs<T>) => {
  const [unControlledProp, setUncontrolledProp] = useUnControlledState({
    defaultValue,
    onChange,
  });
  const isControlled = controlledProp !== undefined;
  const value = isControlled ? controlledProp : unControlledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
    React.useCallback(
      (newValue) => {
        if (isControlled) {
          const setter = newValue as SetStateFunc<T>;
          const nextValue =
            typeof newValue === "function" ? setter(controlledProp) : newValue;
          if (nextValue !== controlledProp) {
            handleChange(nextValue as T);
          }
        } else {
          setUncontrolledProp(newValue);
        }
      },
      [controlledProp, handleChange, isControlled, setUncontrolledProp],
    );

  return [value, setValue] as const;
};

export default useControllableState;
