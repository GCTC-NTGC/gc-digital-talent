import { ReactNode, createContext, useContext, useMemo } from "react";

interface NavMenuContextValue {
  open: boolean;
  onOpenToggle?: () => void;
  onOpenChange?: (newOpen: boolean) => void;
}

const NavMenuContext = createContext<NavMenuContextValue | undefined>(
  undefined,
);

type NavMenuProviderProps = {
  children: ReactNode;
} & NavMenuContextValue;

const NavMenuProvider = ({ children, ...context }: NavMenuProviderProps) => {
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
    <NavMenuContext.Provider value={value}>{children}</NavMenuContext.Provider>
  );
};

export const useNavMenuContext = () => {
  const context = useContext(NavMenuContext);

  return context;
};

export default NavMenuProvider;
