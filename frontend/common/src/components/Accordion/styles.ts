import { AccordionMode } from "./Accordion";

type AccordionStyles = Record<string, string | undefined>;

const cardStyles: AccordionStyles = {
  "data-h2-background-color": "base(white)",
  "data-h2-color":
    "base:children[.Accordion__Separator](dt-gray) base:children[.Accordion__Chevron](dt-gray)",
  "data-h2-border-left": `
  base:children[.Accordion__Item](x.5 solid tm-blue)
  base:children[.Accordion__Item[data-state='open']](x.5 solid tm-purple)
  `,
  "data-h2-height": "base:children[.Accordion__Separator](1px)",
  "data-h2-margin": `
    base:children[.Accordion__Item](x.5, 0)
    base:children[.Accordion__Separator](-x.25 0 x.5 0)
  `,
  "data-h2-padding": `
      base:children[.Accordion__Item](x1 x2 0 x1)
      base:children[.Accordion__Content](0 0 x1 x2)
  `,
  "data-h2-radius":
    "base:children[.Accordion__Item](0px, rounded, rounded, 0px)",
  "data-h2-shadow": "base:children[.Accordion__Item](l)",
};

const simpleStyles: AccordionStyles = {
  "data-h2-color": `
    base:children[.Accordion__Separator](tm-blue)
    base:children[.Accordion__Chevron](tm-blue)
    base:children[.Accordion__Subtitle](tm-blue)
  `,
  "data-h2-display": "base:children[.Accordion__Separator](none)",
  "data-h2-padding": `
    base:children[.Accordion__Item](x1 x2 0 x1)
    base:children[.Accordion__Content](0 0 x1 x2)
  `,
};

const styleMap: Map<AccordionMode, AccordionStyles> = new Map([
  ["card", cardStyles],
  ["simple", simpleStyles],
]);

export default styleMap;
