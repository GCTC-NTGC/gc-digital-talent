import { createContext, useContext } from "react";

import type { Color } from "../../types";

/** All theme colors except black and white. */
export type SummaryColor = Exclude<Color, "black" | "white">;

/** Shared values propagated from `SummaryList.Root` to every descendant item. */
export interface SummaryListContextValue {
  /** Accent color applied to timeline markers, action buttons, and title hover states. */
  color?: SummaryColor;
  /** Alternates item background for improved scannability. */
  striped?: boolean;
  /** Visual separator between items. `"line"` draws a border; `"timeline"` renders a connected dot-and-line track. */
  divider?: "line" | "timeline";
  /** `true` when rendered inside a `SummaryList.Root` `<ul>`; controls whether items render as `<li>` or `<div>`. */
  inList?: boolean;
}

export const SummaryListContext = createContext<SummaryListContextValue>({
  inList: false,
  striped: false,
  color: "primary",
});

/** Returns the nearest `SummaryList.Root` context values. */
export const useSummaryList = () => useContext(SummaryListContext);

interface SummaryItemContextValue {
  color?: SummaryColor;
}

export const SummaryItemContext = createContext<SummaryItemContextValue>({});

/** Returns the resolved color for the current item (item prop overrides list default). */
export const useSummaryItem = () => useContext(SummaryItemContext);

interface SummaryActionContextValue {
  color?: SummaryColor;
}

export const SummaryActionContext = createContext<SummaryActionContextValue>(
  {},
);

/** Returns the resolved color for the current action slot (inherits from item context). */
export const useSummaryAction = () => useContext(SummaryActionContext);
