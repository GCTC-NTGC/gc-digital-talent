import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const usePortal = (id: string, children: React.ReactNode) => {
  // Use existing element or create new one
  const el = React.useRef(
    document.getElementById(id) || document.createElement("div"),
  );
  const [dynamic] = React.useState(!el.current.parentElement);

  useEffect(() => {
    const elRef = el.current;
    // Add the element to the DOM is it isn't already
    if (dynamic) {
      elRef.id = id;
      document.body.appendChild(elRef);
    }

    // Remove from the DOM on unmount
    return () => {
      if (dynamic && elRef.parentElement) {
        elRef.parentElement.removeChild(elRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return createPortal(children, el.current);
};

export default usePortal;
