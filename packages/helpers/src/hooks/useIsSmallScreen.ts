import { useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg";

const breakpoints: Record<Breakpoint, string> = {
  xs: "48rem",
  sm: "67.5rem",
  md: "80rem",
  lg: "100rem",
};

function useIsSmallScreen(threshold: Breakpoint): boolean;
function useIsSmallScreen(threshold: string): boolean;
function useIsSmallScreen(threshold: string): boolean {
  const value = breakpoints[threshold as Breakpoint] ?? threshold;
  // Must be the exact complement of the Tailwind `sm:` variant, which compiles
  // to `(width >= <value>)`. A `max-width` query would also match at exactly
  // <value>, leaving CSS on the desktop side while this hook reports mobile.
  const query = `(width < ${value})`;

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mql = window.matchMedia(query);
    const handler = () => setIsSmallScreen(mql.matches);

    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, [query]);

  return isSmallScreen;
}

export default useIsSmallScreen;
