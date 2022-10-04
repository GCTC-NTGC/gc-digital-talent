import { useContext } from "react";
import { ThemeContext } from "../components/Theme";

const useTheme = () => {
  const theme = useContext(ThemeContext);

  return theme;
};

export default useTheme;
