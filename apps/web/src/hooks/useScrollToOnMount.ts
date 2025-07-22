import { RefObject, useEffect, useRef } from "react";

interface UseScrollToOnMountOptions extends ScrollToOptions {
  preventAutoFocus?: boolean;
}

function useScrollToOnMount<TRef extends HTMLElement>(
  opts?: UseScrollToOnMountOptions,
): RefObject<TRef> {
  const el = useRef<TRef>(null);
  useEffect(() => {
    const { preventAutoFocus, ...restOpts }: UseScrollToOnMountOptions = {
      preventAutoFocus: false,
      top: 0,
      left: 0,
      behavior: "instant",
      ...opts,
    };
    if (el?.current && !preventAutoFocus && typeof window !== "undefined") {
      // Focus heading and scroll to top
      el.current.focus({ preventScroll: false });
      window.scrollTo(restOpts);
    }
    // NOTE: This is an on mount hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return el;
}

export default useScrollToOnMount;
