import React from "react";
import { Story, Meta } from "@storybook/react";

import { TableOfContents } from "./index";

export default {
  component: TableOfContents.Navigation,
  title: "Components/Table of Contents",
} as Meta;

const items = [
  {
    id: "lorem",
    title: "Lorem",
  },
  {
    id: "ipsum",
    title: "Ipsum",
  },
  {
    id: "dolor",
    title: "Dolor",
  },
  {
    id: "amet",
    title: "Amet",
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
      <div
        data-h2-flex-item="b(1of1) s(1of4)"
        data-h2-position="b(sticky)"
        data-h2-text-align="b(right)"
        data-h2-visibility="b(hidden) s(visible)"
      >
        <TableOfContents.Navigation />
      </div>
      <div data-h2-flex-item="b(1of1) s(3of4)">
        <div data-h2-padding="b(left, l)">
          {items.map((item) => (
            <TableOfContents.Section
              key={item.id}
              {...item}
              style={{ display: "block", height: "100vh" }}
            >
              Testing this
            </TableOfContents.Section>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SideMenu = TemplateTableOfContents.bind({});
