import Button from "../Button";
import Link from "../Link";
import { AccordionMetaData } from "./Accordion";

export const testMetaData: AccordionMetaData[] = [
  {
    key: "button-id",
    type: "button",
    children: (
      <Button mode="text" color="primary">
        Button label
      </Button>
    ),
  },
  {
    key: "link-id",
    type: "link",
    children: (
      <Link mode="text" color="primary">
        Link label
      </Link>
    ),
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
];
