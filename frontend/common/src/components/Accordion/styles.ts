import { AccordionColor, AccordionMode } from "./Accordion";

type HydrogenDataAttrs = Record<string, string>;
type ColorMap = Map<AccordionColor, HydrogenDataAttrs>;

export const cardColorMap: ColorMap = new Map([
  ["primary", {}],
  ["secondary", {}],
  ["tertiary", {}],
  ["quaternary", {}],
  ["quinary", {}],
  ["white", {}],
  ["black", {}],
]);

export const simpleColourMap: ColorMap = new Map([
  ["primary", {}],
  ["secondary", {}],
  ["tertiary", {}],
  ["quaternary", {}],
  ["quinary", {}],
  ["white", {}],
  ["black", {}],
]);

export const styleMap: Map<AccordionMode, ColorMap> = new Map([
  ["card", cardColorMap],
  ["simple", simpleColourMap],
]);
