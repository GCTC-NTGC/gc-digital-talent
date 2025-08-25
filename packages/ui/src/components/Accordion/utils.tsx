import { action } from "storybook/actions";

import { AccordionMetaDataProps } from "./Accordion";
import MetaDataButton from "./MetaDataButton";

export const testMetaData: AccordionMetaDataProps["metadata"] = [
  {
    key: "button-id",
    type: "button",
    children: "Button label",
  },
  {
    key: "button-component-id",
    type: "button-component",
    component: (
      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
      <MetaDataButton onClick={action("MetaDataButton.onClick")}>
        Button component
      </MetaDataButton>
    ),
  },
  {
    key: "link-id",
    type: "link",
    href: "#",
    children: "Link label",
  },
  {
    key: "chip-id",
    type: "chip",
    color: "secondary",
    children: "Chip label",
  },
  {
    key: "text-2-id",
    type: "text",
    children: "Text",
  },
  {
    key: "status-item",
    label: "status",
    status: "selected",
    type: "status_item",
  },
];
