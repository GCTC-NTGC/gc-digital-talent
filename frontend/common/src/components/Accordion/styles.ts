import { AccordionMode } from "./Accordion";

type AccordionStyles = Record<string, string | undefined>;

const cardStyles: AccordionStyles = {
  "data-h2-background-color": "base(white)",
  "data-h2-color":
    "base:selectors[>.Accordion__Item .Accordion__Separator](dt-gray) base:selectors[>.Accordion__Item .Accordion__Chevron](black)",
  "data-h2-border-left": `
  base:selectors[>.Accordion__Item .Accordion__Trigger](x.5 solid tm-blue)
  base:selectors[>.Accordion__Item .Accordion__Content](x.5 solid tm-blue)
  base:selectors[>.Accordion__Item[data-state='open'] .Accordion__Trigger](x.5 solid tm-purple)
  base:selectors[>.Accordion__Item[data-state='open'] .Accordion__Content](x.5 solid tm-purple)
  `,
  "data-h2-height":
    "base:selectors[>.Accordion__Item .Accordion__Separator](1px)",
  "data-h2-margin": `
    base:selectors[>.Accordion__Item](x.5, 0)
    base:selectors[>.Accordion__Item .Accordion__Separator](-x.25 0 x.5 0)
  `,
  "data-h2-padding": `
      base:selectors[>.Accordion__Item .Accordion__Trigger](x1 x2 x1 x1)
      base:selectors[>.Accordion__Item .Accordion__Content](0 0 x1 x2)
  `,
  "data-h2-radius":
    "base:selectors[>.Accordion__Item](0px, rounded, rounded, 0px)",
  "data-h2-shadow": "base:selectors[>.Accordion__Item](l)",
};

const simpleStyles: AccordionStyles = {
  "data-h2-color": `
    base:selectors[>.Accordion__Item .Accordion__Separator](tm-blue)
    base:selectors[>.Accordion__Item .Accordion__Chevron](tm-blue)
    base:selectors[>.Accordion__Item .Accordion__Subtitle](tm-blue)
  `,
  "data-h2-display":
    "base:selectors[>.Accordion__Item .Accordion__Separator](none)",
  "data-h2-padding": `
    base:selectors[>.Accordion__Item](x1 x2 0 x1)
    base:selectors[>.Accordion__Item .Accordion__Content](0 0 x1 x2)
  `,
};

const styleMap: Map<AccordionMode, AccordionStyles> = new Map([
  ["card", cardStyles],
  ["simple", simpleStyles],
]);

export default styleMap;
