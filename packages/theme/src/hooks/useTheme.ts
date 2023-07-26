import { useContext } from "react";

import { ThemeContext, ThemeState } from "../components/ThemeProvider";

const useTheme = (): ThemeState => {
  const theme = useContext(ThemeContext);

  return theme;
};

export default useTheme;
