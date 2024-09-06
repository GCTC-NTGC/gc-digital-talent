import { ReactNode, createContext, useContext, useMemo } from "react";

interface ToggleSectionContextValue {
  contentId: string;
  open: boolean;
  onOpenToggle?: () => void;
  onOpenChange?: (newOpen: boolean) => void;
}

const ToggleSectionContext = createContext<
  ToggleSectionContextValue | undefined
>(undefined);

type ToggleSectionProviderProps = {
  children: ReactNode;
} & ToggleSectionContextValue;

export const ToggleSectionProvider = ({
  children,
  ...context
}: ToggleSectionProviderProps) => {
  const { contentId, open, onOpenToggle, onOpenChange } = context;
  const value = useMemo(
    () => ({
      contentId,
      open,
      onOpenToggle,
      onOpenChange,
    }),
    [contentId, open, onOpenToggle, onOpenChange],
  );

  return (
    <ToggleSectionContext.Provider value={value}>
      {children}
    </ToggleSectionContext.Provider>
  );
};

export const useToggleSectionContext = () => {
  const context = useContext(ToggleSectionContext);

  return context;
};
