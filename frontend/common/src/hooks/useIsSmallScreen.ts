import { useLayoutEffect, useState } from "react";
import debounce from "lodash/debounce";

const useIsSmallScreen = (threshold = 1024, wait = 250) => {
  const [isSmallScreen, setSmallScreen] = useState(
    window.innerWidth < threshold,
  );

  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSmallScreen(window.innerWidth < threshold);
    };

    window.addEventListener("resize", debounce(updateSize, wait));

    return (): void => window.removeEventListener("resize", updateSize);
  }, [threshold, wait]);

  return isSmallScreen;
};

export default useIsSmallScreen;
