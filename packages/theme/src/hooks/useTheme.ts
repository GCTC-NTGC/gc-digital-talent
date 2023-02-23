import { useContext } from "react";

import { ThemeContext } from "../components/ThemeProvider";

const useTheme = () => {
  const theme = useContext(ThemeContext);

  return theme;
};

export default useTheme;
