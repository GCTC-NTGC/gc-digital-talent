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
  const query = `(max-width: ${value})`;
  const getMatches = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [isSmallScreen, setIsSmallScreen] = useState(getMatches);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mql = window.matchMedia(query);
    const handler = () => {
      const matches = mql.matches;
      setIsSmallScreen((prev) => (prev !== matches ? matches : prev));
    };

    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, [query]);

  return isSmallScreen;
}

export default useIsSmallScreen;
