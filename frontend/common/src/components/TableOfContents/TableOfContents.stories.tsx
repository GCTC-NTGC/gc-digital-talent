import React from "react";
import { Story, Meta } from "@storybook/react";

import TableOfContents from ".";

export default {
  component: TableOfContents.Wrapper,
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
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        {items.map((item) => (
          <TableOfContents.AnchorLink key={item.id} id={item.id}>
            {item.title}
          </TableOfContents.AnchorLink>
        ))}
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        {items.map((item) => (
          <TableOfContents.Section
            key={item.id}
            id={item.id}
            style={{ height: "100vh" }}
          >
            <TableOfContents.Heading>{item.title}</TableOfContents.Heading>
          </TableOfContents.Section>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export const SideMenu = TemplateTableOfContents.bind({});
