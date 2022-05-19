import React from "react";
import { Story, Meta } from "@storybook/react";

import TableOfContents from "./TableOfContents";
import type { TableOfContentsProps } from "./TableOfContents";

export default {
  component: TableOfContents,
  title: "Components/Table of Contents",
} as Meta;

const items = [
  {
    id: "lorem",
    label: "Lorem",
  },
  {
    id: "ipsum",
    label: "Ipsum",
  },
  {
    id: "dolor",
    label: "Dolor",
  },
  {
    id: "amet",
    label: "Amet",
  },
];

const TemplateTableOfContents: Story = () => {
  return (
    <div
      data-h2-position="b(relative)"
      data-h2-flex-grid="b(top, contained, flush, none)"
      data-h2-container="b(center, l)"
      data-h2-padding="b(right-left, s)"
    >
      <TableOfContents data-h2-flex-item="b(1of1) s(1of4)" items={items}>
        {items.map((item) => (
          <div style={{ height: "100vh" }} key={item.id}>
            <h2>{item.label}</h2>
          </div>
        ))}
      </TableOfContents>
    </div>
  );
};

export const SideMenu = TemplateTableOfContents.bind({});
