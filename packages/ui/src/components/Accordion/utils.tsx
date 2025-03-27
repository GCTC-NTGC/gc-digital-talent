import { AccordionMetaDataProps } from "./Accordion";

export const testMetaData: AccordionMetaDataProps["metadata"] = [
  {
    key: "button-id",
    type: "button",
    children: "Button label",
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
