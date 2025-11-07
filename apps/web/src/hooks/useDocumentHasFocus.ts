import { useState, useEffect } from "react";

const useDocumentHasFocus = () => {
  const [hasFocus, setHasFocus] = useState(document.hasFocus());

  useEffect(() => {
    const onFocus = () => setHasFocus(true);
    const onBlur = () => setHasFocus(false);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return hasFocus;
};

export default useDocumentHasFocus;
