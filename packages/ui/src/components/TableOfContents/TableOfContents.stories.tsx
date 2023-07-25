import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import TableOfContents from ".";
import Button from "../Button";

export default {
  component: TableOfContents.Wrapper,
  title: "Components/Table of Contents",
};

faker.seed(0);
const items = [
  {
    id: "item-1",
    title: faker.lorem.word(5),
  },
  {
    id: "item-2",
    title: faker.lorem.words(1),
    subItems: [
      {
        id: "sub-item-1",
        title: faker.lorem.word(2),
      },
      {
        id: "sub-item-2",
        title: faker.lorem.word(2),
      },
    ],
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

const TemplateTableOfContents: StoryFn = () => {
  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
          {items.map((item) => (
            <TableOfContents.ListItem key={item.id}>
              <TableOfContents.AnchorLink id={item.id}>
                {item.title}
              </TableOfContents.AnchorLink>
              {item.subItems?.length ? (
                <TableOfContents.List space="sm">
                  {item.subItems.map((subItem) => (
                    <TableOfContents.ListItem key={subItem.id}>
                      <TableOfContents.AnchorLink id={subItem.id}>
                        {subItem.title}
                      </TableOfContents.AnchorLink>
                    </TableOfContents.ListItem>
                  ))}
                </TableOfContents.List>
              ) : null}
            </TableOfContents.ListItem>
          ))}
        </TableOfContents.List>
        <Button
          mode="solid"
          color="secondary"
          block
          onClick={() => action("Button Clicked")}
        >
          {faker.lorem.word()}
        </Button>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        {items.map((item) => (
          <>
            <TableOfContents.Section
              key={item.id}
              id={item.id}
              style={{ height: "100vh" }}
            >
              <TableOfContents.Heading>{item.title}</TableOfContents.Heading>
            </TableOfContents.Section>
            {item.subItems?.length ? (
              <>
                {item.subItems.map((subItem) => (
                  <TableOfContents.Section
                    key={subItem.id}
                    id={subItem.id}
                    style={{ height: "100vh" }}
                  >
                    <TableOfContents.Heading as="h3" size="h4">
                      {subItem.title}
                    </TableOfContents.Heading>
                  </TableOfContents.Section>
                ))}
              </>
            ) : null}
          </>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export const SideMenu = TemplateTableOfContents.bind({});
