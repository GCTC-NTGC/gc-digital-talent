import { AccordionMode, AccordionStyles } from "./types";

const cardStyles: AccordionStyles = {
  "data-h2-background-color": "base:selectors[>.Accordion__Item](foreground)",
  "data-h2-border-bottom":
    "base:selectors[>.Accordion__Item:nth-of-type(n+1)](thin solid gray)",
  "data-h2-padding":
    "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1) base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x2.5)",
  "data-h2-radius":
    "base(s) base:selectors[>.Accordion__Item:first-of-type](s s 0 0) base:selectors[>.Accordion__Item:last-child](0 0 s s)",
  "data-h2-shadow": "base(l)",
};

const simpleStyles: AccordionStyles = {
  "data-h2-color": `
    base:selectors[>.Accordion__Item > .Accordion__Content > .Accordion__Separator](secondary.dark)
    base:selectors[>.Accordion__Item > .Accordion__Header > .Accordion__Trigger > .Accordion__Chevron](secondary.dark)
    base:selectors[>.Accordion__Item > .Accordion__Header > .Accordion__Trigger .Accordion__Subtitle](black.light)
  `,
  "data-h2-display":
    "base:selectors[>.Accordion__Item .Accordion__Separator](none)",
  "data-h2-padding": `
    base:selectors[>.Accordion__Item > .Accordion__Header > .Accordion__Trigger](x.5 x1)
    base:selectors[>.Accordion__Item > .Accordion__Content](0 x2 x1 x3)
  `,
};

const rootStyleMap: Map<AccordionMode, AccordionStyles> = new Map([
  ["card", cardStyles],
  ["simple", simpleStyles],
]);

export default rootStyleMap;
