import * as React from "react";

type SideMenuContextValue = {
  open: boolean;
  onOpenToggle?: () => void;
  onOpenChange?: (newOpen: boolean) => void;
};

const SideMenuContext = React.createContext<SideMenuContextValue | undefined>(
  undefined,
);

type SideMenuProviderProps = {
  children: React.ReactNode;
} & SideMenuContextValue;

export const SideMenuProvider = ({
  children,
  ...context
}: SideMenuProviderProps) => {
  const { open, onOpenToggle, onOpenChange } = context;
  const value = React.useMemo(
    () => ({
      open,
      onOpenToggle,
      onOpenChange,
    }),
    [open, onOpenToggle, onOpenChange],
  );

  return (
    <SideMenuContext.Provider value={value}>
      {children}
    </SideMenuContext.Provider>
  );
};

export const useSideMenuContext = () => {
  const context = React.useContext(SideMenuContext);

  return context;
};
