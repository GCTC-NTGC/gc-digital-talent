import { ReactNode, createContext, useContext, useMemo } from "react";

interface SideMenuContextValue {
  open: boolean;
  onOpenToggle?: () => void;
  onOpenChange?: (newOpen: boolean) => void;
}

const SideMenuContext = createContext<SideMenuContextValue | undefined>(
  undefined,
);

type SideMenuProviderProps = {
  children: ReactNode;
} & SideMenuContextValue;

export const SideMenuProvider = ({
  children,
  ...context
}: SideMenuProviderProps) => {
  const { open, onOpenToggle, onOpenChange } = context;
  const value = useMemo(
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
  const context = useContext(SideMenuContext);

  return context;
};
