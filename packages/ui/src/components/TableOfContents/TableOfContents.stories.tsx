import React from "react";
import { Story, Meta } from "@storybook/react";

import { faker } from "@faker-js/faker";
import TableOfContents from ".";

export default {
  component: TableOfContents.Wrapper,
  title: "Components/Table of Contents",
} as Meta;

faker.seed(0);
const items = [
  {
    id: "item-1",
    title: faker.lorem.word(5),
  },
  {
    id: "item-2",
    title: faker.lorem.words(1),
  },
  {
    id: "item-3",
    title: faker.lorem.words(2),
  },
  {
    id: "item-4",
    title: faker.lorem.words(3),
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
