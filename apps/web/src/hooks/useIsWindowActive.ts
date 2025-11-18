import { useEffect, useRef, useState } from "react";

export function useIsWindowActive(debounce = 150) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isActive, setIsActive] = useState<boolean>(
    !document.hidden && document.hasFocus(),
  );

  useEffect(() => {
    const update = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setIsActive(!document.hidden && document.hasFocus());
      }, debounce);
    };

    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    window.addEventListener("blur", update);

    return () => {
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("blur", update);
    };
  }, [debounce]);

  return isActive;
}

export default useIsWindowActive;
