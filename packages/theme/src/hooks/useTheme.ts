import { useContext } from "react";

import type { ThemeState } from "../components/ThemeProvider";
import { ThemeContext } from "../components/ThemeProvider";

const useTheme = (): ThemeState => {
  const theme = useContext(ThemeContext);

  return theme;
};

export default useTheme;
