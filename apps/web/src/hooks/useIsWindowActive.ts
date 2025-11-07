import { useEffect, useState } from "react";

export function useIsWindowActive() {
  const [isActive, setIsActive] = useState(!document.hidden);

  useEffect(() => {
    const update = () => setIsActive(!document.hidden && document.hasFocus());

    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    window.addEventListener("blur", update);

    return () => {
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("blur", update);
    };
  }, []);

  return isActive;
}

export default useIsWindowActive;
