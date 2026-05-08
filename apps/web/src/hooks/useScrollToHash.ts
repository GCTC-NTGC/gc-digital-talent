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
  scrollDelay = 10,
): void {
  const { hash } = useLocation();
  const callbackRef = useRef(onHashMatch);

  useEffect(() => {
    callbackRef.current = onHashMatch;
  }, [onHashMatch]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (hash === `#${targetId}`) {
      callbackRef.current?.();
      timer = setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, scrollDelay);
    }

    return () => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    };
  }, [hash, targetId, scrollDelay]);
}

export default useScrollToHash;
