import React from "react";
import { navigate } from "../../helpers/router";

interface LinkClickHandlerOptions {
  to: string;
  target?: React.HTMLAttributeAnchorTarget;
}

const isHoldingModifier = (e: React.MouseEvent) => {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
};

function useLinkClickHandler<T extends HTMLAnchorElement>({
  to,
  target,
}: LinkClickHandlerOptions): (event: React.MouseEvent<T, MouseEvent>) => void {
  return React.useCallback(
    (e: React.MouseEvent<T, MouseEvent>) => {
      if (
        e.button === 0 && // Left Click
        (!target || target === "_self") && // Only care about same tab/window
        !isHoldingModifier(e) // Not holding meta, ctrl, alt, shift when clicking
      ) {
        e.preventDefault(); // Don't allow the link to navigate

        navigate(to);
      }
    },
    [to, target],
  );
}

export default useLinkClickHandler;
