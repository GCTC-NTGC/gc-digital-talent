import { createContext, useContext } from "react";

import type { Color } from "../../types";

export type SummaryColor = Exclude<Color, "black" | "white">;

interface SummaryListContextValue {
  color?: SummaryColor;
  striped?: boolean;
  timeline?: boolean;
  inList?: boolean;
}

export const SummaryListContext = createContext<SummaryListContextValue>({
  inList: false,
  striped: false,
  color: "primary",
  timeline: false,
});

export const useSummaryList = () => useContext(SummaryListContext);

interface SummaryItemContextValue {
  color?: SummaryColor;
}

export const SummaryItemContext = createContext<SummaryItemContextValue>({});

export const useSummaryItem = () => useContext(SummaryItemContext);

interface SummaryActionContextValue {
  color?: SummaryColor;
}

export const SummaryActionContext = createContext<SummaryActionContextValue>(
  {},
);

export const useSummaryAction = () => useContext(SummaryActionContext);
