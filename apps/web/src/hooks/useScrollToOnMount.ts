import { useEffect } from "react";

interface UseScrollToOnMountOptions extends ScrollToOptions {
  preventAutoFocus?: boolean;
}

function useScrollToOnMount(
  el: HTMLElement,
  {
    behavior = "instant",
    top = 0,
    left = 0,
    preventAutoFocus,
  }: UseScrollToOnMountOptions,
) {
  useEffect(() => {
    if (el && !preventAutoFocus && typeof window !== "undefined") {
      // Focus heading and scroll to top
      el.focus({ preventScroll: false });
      window.scrollTo({ top, left, behavior });
    }
    // NOTE: This is an on mount hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useScrollToOnMount;
