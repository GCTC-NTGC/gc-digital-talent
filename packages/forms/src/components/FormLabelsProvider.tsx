import { createContext, ReactNode, useContext, useRef } from "react";

const numberRegex = /(\d+)/g;

export const normalizeName = (name: string): string => {
  let normalized = name;
  // This is a root error for a field array
  if (name.includes(".root")) {
    normalized = name.replace(".root", "");
  } else if (numberRegex.test(name)) {
    // If a number exists in the field name, replace it with an asterisk
    normalized = name.replace(numberRegex, "*");
  }

  return normalized;
};

type FieldLabels = Record<string, ReactNode>;

interface LabelsContextState {
  labels: FieldLabels;
  registerLabel: (name: string, label: ReactNode) => void;
}

const LabelsContext = createContext<LabelsContextState>({
  labels: {},
  registerLabel: () => {
    // noop
  },
});

interface FormLabelsProviderProps {
  children: ReactNode;
}

export const FormLabelsProvider = ({ children }: FormLabelsProviderProps) => {
  const labelsRef = useRef<FieldLabels>({});

  const registerLabel = (name: string, label: ReactNode) => {
    labelsRef.current[normalizeName(name)] = label;
  };

  return (
    <LabelsContext.Provider
      value={{ labels: labelsRef.current, registerLabel }}
    >
      {children}
    </LabelsContext.Provider>
  );
};

export const useFormLabels = () => useContext(LabelsContext);
export const useRegisterFormLabel = (name: string, label: ReactNode) => {
  const { registerLabel } = useFormLabels();
  registerLabel(name, label);
};
