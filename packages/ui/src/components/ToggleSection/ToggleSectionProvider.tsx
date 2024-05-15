import * as React from "react";

type ToggleSectionContextValue = {
  contentId: string;
  open: boolean;
  onOpenToggle?: () => void;
  onOpenChange?: (newOpen: boolean) => void;
};

const ToggleSectionContext = React.createContext<
  ToggleSectionContextValue | undefined
>(undefined);

type ToggleSectionProviderProps = {
  children: React.ReactNode;
} & ToggleSectionContextValue;

export const ToggleSectionProvider = ({
  children,
  ...context
}: ToggleSectionProviderProps) => {
  const { contentId, open, onOpenToggle, onOpenChange } = context;
  const value = React.useMemo(
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
  const context = React.useContext(ToggleSectionContext);

  return context;
};
