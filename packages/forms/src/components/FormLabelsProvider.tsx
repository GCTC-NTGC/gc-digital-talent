import { createContext, ReactNode, useContext, useRef } from "react";

type FieldLabels = Record<string, ReactNode>;

interface LabelsContextState {
  labels: FieldLabels;
  setLabel: (name: string, label: ReactNode) => void;
}

const LabelsContext = createContext<LabelsContextState>({
  labels: {},
  setLabel: () => {
    // noop
  },
});

interface FormLabelsProviderProps {
  children: ReactNode;
}

export const FormLabelsProvider = ({ children }: FormLabelsProviderProps) => {
  const labelsRef = useRef<FieldLabels>({});

  const setLabel = (name: string, label: ReactNode) => {
    labelsRef.current[name] = label;
  };

  return (
    <LabelsContext.Provider value={{ labels: labelsRef.current, setLabel }}>
      {children}
    </LabelsContext.Provider>
  );
};

export const useFormLabels = () => useContext(LabelsContext);
