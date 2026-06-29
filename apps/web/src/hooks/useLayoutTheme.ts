import { useEffect } from "react";
import { useLocation } from "react-router";

import type { ThemeKey } from "@gc-digital-talent/theme";
import { useTheme } from "@gc-digital-talent/theme";

type UseLayoutTheme = (layoutKey: ThemeKey) => void;

const useLayoutTheme: UseLayoutTheme = (layoutKey) => {
  const { pathname } = useLocation();
  const { setKey, key } = useTheme();

  useEffect(() => {
    if (key !== layoutKey) {
      setKey(layoutKey);
    }
    // Note: Check on every navigation
  }, [pathname, layoutKey, key, setKey]);
};

export default useLayoutTheme;
