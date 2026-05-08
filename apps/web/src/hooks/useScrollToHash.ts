import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * When the URL hash matches the given targetId, calls onHashMatch
 * (if provided) and then scrolls the element with that ID into view.
 * Re-runs whenever the URL hash changes.
 */
function useScrollToHash(
  targetId: string,
  onHashMatch?: () => void,
  scrollDelay = 300,
): void {
  const { hash } = useLocation();
  const callbackRef = useRef(onHashMatch);

  useEffect(() => {
    callbackRef.current = onHashMatch;
  }, [onHashMatch]);

  useEffect(() => {
    if (hash !== `#${targetId}`) return;
    callbackRef.current?.();
    const timer = setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, scrollDelay);
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timer);
  }, [hash, targetId, scrollDelay]);
}

export default useScrollToHash;
