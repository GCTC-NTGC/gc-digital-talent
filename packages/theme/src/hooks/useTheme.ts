import { useContext } from "react";

import { ThemeContext, type ThemeState } from "../components/ThemeProvider";

const useTheme = (): ThemeState => {
  const theme = useContext(ThemeContext);

  return theme;
};

export default useTheme;
